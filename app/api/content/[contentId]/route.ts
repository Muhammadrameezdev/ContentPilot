import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contentId } = await params;
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    if (!content) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  text: z.string().optional(),
  type: z.enum(["TEXT", "IMAGE", "VIDEO", "REEL", "LINK"]).optional(),
  status: z.enum(["DRAFT", "ARCHIVED", "TEMPLATE"]).optional(),
  mediaUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contentId } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    const content = await prisma.content.update({
      where: { id: contentId },
      data,
    });

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    console.error("Content PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contentId } = await params;
    await prisma.content.delete({ where: { id: contentId } });

    return NextResponse.json({ message: "Content deleted" });
  } catch (error) {
    console.error("Content DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
