import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalWorkspaces, totalPages, totalPosts] = await Promise.all([
      prisma.user.count(),
      prisma.workspace.count(),
      prisma.facebookPage.count(),
      prisma.scheduledPost.count(),
    ]);

    const planBreakdown = await prisma.workspace.groupBy({
      by: ["plan"],
      _count: { id: true },
    });

    return NextResponse.json({
      totalUsers,
      totalWorkspaces,
      totalPages,
      totalPosts,
      planBreakdown: planBreakdown.map((p) => ({
        plan: p.plan,
        count: p._count.id,
      })),
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
