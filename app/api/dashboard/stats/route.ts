import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let workspaceId = req.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) {
      workspaceId = await getCurrentWorkspaceId(session.user.id);
    }
    
    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      connectedPages,
      allPosts,
      monthlyAnalytics,
      allPostsData,
      upcomingPostsData,
      publishingPosts,
      analyticsData,
    ] = await Promise.all([
      prisma.facebookPage.count({ where: { workspaceId } }),
      prisma.scheduledPost.groupBy({
        by: ['status'],
        where: { page: { workspaceId } },
        _count: true,
      }),
      prisma.pageAnalytics.aggregate({
        _sum: { reach: true },
        where: { page: { workspaceId }, date: { gte: thirtyDaysAgo } },
      }),
      prisma.scheduledPost.findMany({
        where: { page: { workspaceId } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: { page: true, content: true },
      }),
      prisma.scheduledPost.findMany({
        where: { page: { workspaceId }, status: 'QUEUED', scheduledAt: { gt: new Date() } },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
        include: { page: true, content: true },
      }),
      prisma.scheduledPost.findMany({
        where: { page: { workspaceId }, updatedAt: { gte: thirtyDaysAgo } },
        select: { status: true, updatedAt: true },
      }),
      prisma.pageAnalytics.findMany({
        where: { page: { workspaceId }, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'asc' },
        select: { date: true, reach: true, impressions: true },
      }),
    ]);

    let scheduledPosts = 0;
    let publishedPosts = 0;
    let failedPosts = 0;
    let queueSize = 0;

    for (const group of allPosts) {
      if (group.status === "QUEUED") queueSize += group._count;
      if (group.status === "PUBLISHED") publishedPosts += group._count;
      if (group.status === "FAILED") failedPosts += group._count;
      scheduledPosts += group._count;
    }

    const publishingActivity = Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - index));
      return { day: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), posts: 0 };
    });

    const activityMap = new Map<string, number>();
    publishingPosts.forEach((post) => {
      const day = new Date(post.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      activityMap.set(day, (activityMap.get(day) ?? 0) + 1);
    });

    const publishingActivityData = publishingActivity.map((entry) => ({
      ...entry,
      posts: activityMap.get(entry.day) ?? 0,
    }));

    const engagementTrend = analyticsData.map((entry) => ({
      day: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      reach: entry.reach ?? 0,
      impressions: entry.impressions ?? 0,
    }));

    return NextResponse.json({
      data: {
        connectedPages,
        scheduledPosts,
        publishedPosts,
        failedPosts,
        queueSize,
        monthlyReach: monthlyAnalytics._sum.reach || 0,
        recentActivity: allPostsData.map((post) => ({
          type: post.status.toLowerCase(),
          message: `Post ${post.status.toLowerCase()} on ${post.page.name}`,
          time: post.updatedAt,
        })),
        upcomingPosts: upcomingPostsData.map((post) => ({
          page: post.page.name,
          time: post.scheduledAt,
          text: post.content.text || 'Media post',
        })),
        publishingActivity: publishingActivityData,
        engagementTrend,
      },
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
