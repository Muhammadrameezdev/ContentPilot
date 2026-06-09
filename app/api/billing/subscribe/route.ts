import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCheckoutSession, createCustomer } from "@/lib/stripe";

const schema = z.object({
  workspaceId: z.string(),
  priceId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, priceId } = schema.parse(body);

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) {
      return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    let customerId = workspace.stripeCustomerId;
    if (!customerId) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const customer = await createCustomer(user?.email ?? "", user?.name ?? "");
      customerId = customer.id;
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?cancelled=true`
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    console.error("Subscribe error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
