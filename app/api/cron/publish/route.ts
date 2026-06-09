import { NextRequest, NextResponse } from "next/server";
import { publishQueuedPosts } from "@/lib/jobs/publish-cron";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await publishQueuedPosts();
    return NextResponse.json({ message: "Publishing cron completed" });
  } catch (error) {
    console.error("Publishing cron error:", error);
    return NextResponse.json({ message: "Cron failed" }, { status: 500 });
  }
}
