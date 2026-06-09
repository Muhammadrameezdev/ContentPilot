const GRAPH_API_BASE = "https://graph.facebook.com/v18.0";

interface FacebookApiError {
  error: { message: string };
}

interface InsightValue {
  value: number;
}

interface InsightDataPoint {
  end_time?: string;
  values?: InsightValue[];
}

interface InsightsResponse {
  data?: InsightDataPoint[];
}

export class FacebookClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T = Record<string, unknown>>(endpoint: string, options?: RequestInit): Promise<T> {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${GRAPH_API_BASE}${endpoint}${separator}access_token=${this.accessToken}`;

    const response = await fetch(url, options);
    const data = await response.json();

    if ((data as FacebookApiError).error) {
      throw new Error((data as FacebookApiError).error.message || "Facebook API error");
    }

    return data as T;
  }

  async getPageInfo(pageId: string) {
    return this.request(
      `/${pageId}?fields=id,name,category,fan_count,picture,cover`
    );
  }

  async publishPost(pageId: string, message: string, options?: { link?: string }) {
    const body: Record<string, string> = { message };
    if (options?.link) body.link = options.link;

    return this.request<{ id: string }>(`/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async publishPhoto(pageId: string, imageUrl: string, message: string) {
    return this.request<{ id: string }>(`/${pageId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, url: imageUrl }),
    });
  }

  async publishVideo(pageId: string, videoUrl: string, message: string) {
    return this.request<{ id: string }>(`/${pageId}/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: message, file_url: videoUrl }),
    });
  }

  async getPageInsights(
    pageId: string,
    period: string = "day",
    days: number = 30
  ): Promise<InsightsResponse> {
    const metrics = [
      "page_impressions",
      "page_engaged_users",
      "page_post_engagements",
      "page_fan_adds",
    ].join(",");

    const since = Math.floor((Date.now() - days * 86400000) / 1000);
    const endpoint = `/${pageId}/insights?metric=${metrics}&period=${period}&since=${since}`;

    return this.request<InsightsResponse>(endpoint);
  }

  async getPostInsights(postId: string) {
    return this.request(
      `/${postId}/insights?metric=post_impressions,post_engaged_users,post_clicks`
    );
  }

  async getUserPages(userAccessToken: string) {
    const client = new FacebookClient(userAccessToken);
    return client.request("/me/accounts?fields=id,name,category,fan_count,picture,cover,access_token");
  }
}

export function getOAuthUrl(): string {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`;
  const scopes = [
    "pages_manage_posts",
    "pages_read_engagement",
    "pages_show_list",
    "pages_read_user_content",
    "pages_manage_metadata",
    "read_insights",
  ].join(",");

  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`;
  const response = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
  );
  const data = await response.json();
  return data.access_token;
}
