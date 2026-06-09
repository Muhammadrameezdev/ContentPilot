import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contentId } = await params;
    const original = await prisma.content.findUnique({ where: { id: contentId } });

    if (!original) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    const duplicate = await prisma.content.create({
      data: {
        text: original.text,
        type: original.type,
        status: "DRAFT",
        mediaUrl: original.mediaUrl,
        tags: original.tags,
        workspaceId: original.workspaceId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(duplicate, { status: 201 });
  } catch (error) {
    console.error("Content duplicate error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
