import { NextRequest, NextResponse } from "next/server";
import { retryFailedPosts } from "@/lib/jobs/publish-cron";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await retryFailedPosts();
    return NextResponse.json({ message: "Retry failed posts completed" });
  } catch (error) {
    console.error("Retry failed cron error:", error);
    return NextResponse.json({ message: "Cron failed" }, { status: 500 });
  }
}
