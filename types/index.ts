export type {
  User,
  Workspace,
  WorkspaceMember,
  FacebookPage,
  Content,
  ScheduledPost,
  PageAnalytics,
  Notification,
  Media,
} from "@prisma/client";

export type {
  UserRole,
  MemberRole,
  PlanType,
  ContentType,
  ContentStatus,
  PostStatus,
  NotificationType,
  MediaType,
} from "@prisma/client";

export interface DashboardStats {
  connectedPages: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
  queueSize: number;
  monthlyReach: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AIGenerationRequest {
  industry: string;
  audience: string;
  tone: string;
  goal: string;
  topic: string;
  language: string;
  count: number;
}

export interface AIGeneratedPost {
  id: string;
  text: string;
  hashtags: string[];
  emoji: string;
  engagementTip: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  features: string[];
  pages: number | string;
  posts: string;
  seats: number | string;
  popular?: boolean;
  stripePriceId?: string;
}
