import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FacebookClient } from "@/lib/facebook";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const pages = await prisma.facebookPage.findMany({
      where: { tokenExpiresAt: { gt: new Date() } },
    });

    for (const page of pages) {
      try {
        const client = new FacebookClient(page.accessToken);
        const insights = await client.getPageInsights(page.facebookPageId, "day", 7);

        for (const dataPoint of insights.data ?? []) {
          const date = new Date(dataPoint.end_time ?? new Date());
          await prisma.pageAnalytics.upsert({
            where: { pageId_date: { pageId: page.id, date } },
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
      } catch (error) {
        console.error(`Analytics sync failed for page ${page.name}:`, error);
      }
    }

    return NextResponse.json({ message: "Analytics sync completed" });
  } catch (error) {
    console.error("Analytics cron error:", error);
    return NextResponse.json({ message: "Cron failed" }, { status: 500 });
  }
}
