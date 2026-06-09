import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({ workspaceId: z.string() });

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId } = schema.parse(body);

    const result = await prisma.scheduledPost.deleteMany({
      where: {
        page: { workspaceId },
        status: "FAILED",
      },
    });

    return NextResponse.json({ message: `Cleared ${result.count} failed posts` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    console.error("Clear failed error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
