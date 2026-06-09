import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FacebookClient } from "@/lib/facebook";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await req.json();

    const page = await prisma.facebookPage.findUnique({ where: { id: pageId } });
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const client = new FacebookClient(page.accessToken);

    try {
      const insights = await client.getPageInsights(page.facebookPageId, "day", 30);

      // Upsert analytics data
      for (const dataPoint of insights.data ?? []) {
        const date = new Date(dataPoint.end_time ?? new Date());
        await prisma.pageAnalytics.upsert({
          where: {
            pageId_date: { pageId: page.id, date },
          },
          create: {
            pageId: page.id,
            date,
            reach: dataPoint.values?.[0]?.value ?? 0,
            impressions: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
          },
          update: {
            reach: dataPoint.values?.[0]?.value ?? 0,
          },
        });
      }

      return NextResponse.json({ message: "Analytics synced successfully" });
    } catch (error) {
      console.error("Facebook API error:", error);
      return NextResponse.json({ message: "Failed to sync analytics from Facebook" }, { status: 502 });
    }
  } catch (error) {
    console.error("Analytics sync error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
