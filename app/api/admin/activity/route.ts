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

    // Recent user registrations
    const recentUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Recent published posts
    const recentPosts = await prisma.scheduledPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: {
        page: { select: { name: true } },
        content: { select: { text: true } },
      },
    });

    return NextResponse.json({ recentUsers, recentPosts });
  } catch (error) {
    console.error("Admin activity error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
