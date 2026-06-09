import { NextRequest, NextResponse } from "next/server";
import { checkTokenExpiry } from "@/lib/jobs/publish-cron";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await checkTokenExpiry();
    return NextResponse.json({ message: "Token check completed" });
  } catch (error) {
    console.error("Token check cron error:", error);
    return NextResponse.json({ message: "Cron failed" }, { status: 500 });
  }
}
