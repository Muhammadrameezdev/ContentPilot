import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspaces = await prisma.workspace.findMany({
      where: { members: { some: { userId: session.user.id } } },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
        _count: { select: { pages: true, members: true } },
      },
    });

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Workspaces GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug } = createSchema.parse(body);

    const existing = await prisma.workspace.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: "Slug already taken" }, { status: 409 });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        plan: "STARTER",
        members: { create: { userId: session.user.id, role: "OWNER" } },
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
    }
    console.error("Workspace create error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
