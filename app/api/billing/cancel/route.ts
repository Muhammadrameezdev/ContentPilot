import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cancelSubscription } from "@/lib/stripe";

const schema = z.object({
  workspaceId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId } = schema.parse(body);

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace?.stripeSubscriptionId) {
      return NextResponse.json({ message: "No active subscription" }, { status: 400 });
    }

    await cancelSubscription(workspace.stripeSubscriptionId);

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { plan: "STARTER" },
    });

    return NextResponse.json({ message: "Subscription cancelled" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    console.error("Cancel error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
