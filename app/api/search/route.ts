import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (!query) {
      return NextResponse.json({ posts: [], pages: [], queue: [], members: [] });
    }

    const workspaceId = await getCurrentWorkspaceId(session.user.id);
    if (!workspaceId) {
      return NextResponse.json({ posts: [], pages: [], queue: [], members: [] });
    }

    const [posts, pages, queue, members] = await Promise.all([
      prisma.content.findMany({
        where: {
          workspaceId,
          text: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { id: true, text: true, type: true },
      }),
      prisma.facebookPage.findMany({
        where: {
          workspaceId,
          name: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { id: true, name: true, category: true },
      }),
      prisma.scheduledPost.findMany({
        where: {
          page: { workspaceId },
          content: { text: { contains: query, mode: "insensitive" } },
        },
        take: 5,
        include: { page: true, content: true },
      }),
      prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          OR: [
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
          ],
        },
        take: 5,
        include: { user: true },
      }),
    ]);

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        title: post.text.substring(0, 60),
        subtitle: post.type,
        href: "/library",
        badge: "Post",
      })),
      pages: pages.map((page) => ({
        id: page.id,
        title: page.name,
        subtitle: page.category || "Facebook Page",
        href: "/pages",
        badge: "Page",
      })),
      queue: queue.map((item) => ({
        id: item.id,
        title: item.content.text ? item.content.text.substring(0, 60) : "Scheduled queue item",
        subtitle: item.page.name,
        href: "/queue",
        badge: "Queue",
      })),
      members: members.map((member) => ({
        id: member.id,
        title: member.user.name || member.user.email || "Team member",
        subtitle: member.user.email || "",
        href: "/dashboard/team",
        badge: "Member",
      })),
    });
  } catch (error) {
    console.error("Search GET error:", error);
    return NextResponse.json({ posts: [], pages: [], queue: [], members: [] });
  }
}
