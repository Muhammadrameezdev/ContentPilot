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
    const type = req.nextUrl.searchParams.get("type");
    const status = req.nextUrl.searchParams.get("status");
    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");

    const where: Record<string, unknown> = {};
    if (workspaceId) where.workspaceId = workspaceId;
    if (type) where.type = type;
    if (status) where.status = status;

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.content.count({ where }),
    ]);

    return NextResponse.json({ content, total, page, limit });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const createSchema = z.object({
  workspaceId: z.string(),
  text: z.string().min(1),
  type: z.enum(["TEXT", "IMAGE", "VIDEO", "REEL", "LINK"]),
  status: z.enum(["DRAFT", "ARCHIVED", "TEMPLATE"]).default("DRAFT"),
  mediaUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const content = await prisma.content.create({
      data: {
        text: data.text,
        type: data.type,
        status: data.status,
        mediaUrl: data.mediaUrl,
        tags: data.tags ?? [],
        workspaceId: data.workspaceId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
    }
    console.error("Content POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
