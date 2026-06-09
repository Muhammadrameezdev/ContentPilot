import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await params;
    const page = await prisma.facebookPage.findUnique({ where: { id: pageId } });

    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    // Extend token expiry (in production, would exchange token via Graph API)
    const updatedPage = await prisma.facebookPage.update({
      where: { id: pageId },
      data: {
        tokenExpiresAt: new Date(Date.now() + 60 * 86400000), // 60 days
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Page refresh error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
