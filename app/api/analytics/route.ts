import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pageId = req.nextUrl.searchParams.get("pageId");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (pageId) where.pageId = pageId;
    if (from || to) {
      where.date = {};
      if (from) (where.date as Record<string, unknown>).gte = new Date(from);
      if (to) (where.date as Record<string, unknown>).lte = new Date(to);
    }

    const analytics = await prisma.pageAnalytics.findMany({
      where,
      orderBy: { date: "desc" },
      include: { page: { select: { id: true, name: true } } },
    });

    // Aggregate metrics
    const summary = analytics.reduce(
      (acc, row) => ({
        totalReach: acc.totalReach + row.reach,
        totalImpressions: acc.totalImpressions + row.impressions,
        totalLikes: acc.totalLikes + row.likes,
        totalComments: acc.totalComments + row.comments,
        totalShares: acc.totalShares + row.shares,
        totalClicks: acc.totalClicks + row.clicks,
      }),
      { totalReach: 0, totalImpressions: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalClicks: 0 }
    );

    return NextResponse.json({ analytics, summary });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
