import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";

// REQUIRES: FACEBOOK_APP_ID, FACEBOOK_APP_SECRET env vars
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let workspaceId = await getCurrentWorkspaceId(session.user.id);
    if (!workspaceId) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 });
    }

    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Exchange code for user access token
    const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/pages/connect/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`);
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 400 });
    }

    // Fetch user's pages
    const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`);
    const pagesData = await pagesRes.json();

    if (!pagesData.data) {
      return NextResponse.json({ error: "Failed to get pages" }, { status: 400 });
    }

    for (const page of pagesData.data) {
      // Get page details
      const pageDetailRes = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=followers_count,category,picture&access_token=${page.access_token}`);
      const pageDetail = await pageDetailRes.json();

      await prisma.facebookPage.upsert({
        where: { facebookPageId: page.id },
        update: {
          accessToken: page.access_token,
          name: page.name,
          category: pageDetail.category,
          followers: pageDetail.followers_count || 0,
          profileImage: pageDetail.picture?.data?.url,
          tokenExpiresAt: new Date(Date.now() + 60 * 86400000), // ~60 days
          isActive: true
        },
        create: {
          facebookPageId: page.id,
          name: page.name,
          category: pageDetail.category,
          followers: pageDetail.followers_count || 0,
          profileImage: pageDetail.picture?.data?.url,
          accessToken: page.access_token,
          tokenExpiresAt: new Date(Date.now() + 60 * 86400000), // ~60 days
          workspaceId: workspaceId,
          isActive: true
        }
      });
    }

    return NextResponse.redirect(new URL("/pages", req.url));
  } catch (error) {
    console.error("Facebook connect error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
