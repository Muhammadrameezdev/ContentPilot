import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Members GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;
    const body = await req.json();
    const { email, role } = inviteSchema.parse(body);

    // Check if requester is OWNER or ADMIN
    const requesterMembership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
    });
    if (!requesterMembership || !["OWNER", "ADMIN"].includes(requesterMembership.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const invitedUser = await prisma.user.findUnique({ where: { email } });
    if (!invitedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const member = await prisma.workspaceMember.create({
      data: { userId: invitedUser.id, workspaceId, role },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    console.error("Members POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
