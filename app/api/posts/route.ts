import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    const status = req.nextUrl.searchParams.get("status");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (workspaceId) {
      where.page = { workspaceId };
    }
    if (status) where.status = status;
    if (from || to) {
      where.scheduledAt = {};
      if (from) (where.scheduledAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.scheduledAt as Record<string, unknown>).lte = new Date(to);
    }

    const posts = await prisma.scheduledPost.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
      include: {
        content: true,
        page: { select: { id: true, name: true, facebookPageId: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const createSchema = z.object({
  contentId: z.string(),
  pageId: z.string(),
  scheduledAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const post = await prisma.scheduledPost.create({
      data: {
        contentId: data.contentId,
        pageId: data.pageId,
        scheduledAt: new Date(data.scheduledAt),
        status: "QUEUED",
        scheduledBy: session.user.id,
      },
      include: { content: true, page: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
    }
    console.error("Posts POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
