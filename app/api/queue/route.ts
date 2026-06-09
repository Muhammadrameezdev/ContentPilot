import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json({ message: "workspaceId required" }, { status: 400 });
    }

    const queue = await prisma.scheduledPost.findMany({
      where: {
        page: { workspaceId },
        status: { in: ["QUEUED", "DRAFT", "PUBLISHING", "FAILED"] },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        content: true,
        page: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(queue);
  } catch (error) {
    console.error("Queue GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
