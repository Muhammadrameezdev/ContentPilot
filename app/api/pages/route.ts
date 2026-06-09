import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let workspaceId = req.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) {
      workspaceId = await getCurrentWorkspaceId(session.user.id);
    }
    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
    }

    const pages = await prisma.facebookPage.findMany({
      where: { workspaceId },
      include: { _count: { select: { posts: true } } },
      orderBy: { connectedAt: "desc" },
    });

    return NextResponse.json({ data: pages });
  } catch (error) {
    console.error("Pages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const connectSchema = z.object({
  workspaceId: z.string(),
  facebookPageId: z.string(),
  name: z.string(),
  accessToken: z.string(),
  category: z.string().optional(),
  followers: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = connectSchema.parse(body);

    let workspaceId = data.workspaceId;
    if (!workspaceId) {
      workspaceId = await getCurrentWorkspaceId(session.user.id) ?? "";
      if (!workspaceId) {
        return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
      }
    }

    const page = await prisma.facebookPage.create({
      data: {
        facebookPageId: data.facebookPageId,
        name: data.name,
        accessToken: data.accessToken,
        category: data.category,
        followers: data.followers ?? 0,
        tokenExpiresAt: new Date(Date.now() + 60 * 86400000), // 60 days
        workspaceId,
      },
    });

    return NextResponse.json({ data: page }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    console.error("Pages POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
