import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2026-05-27.dahlia" });
}

// TEMP: bypass type error
type StripeEvent = any;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    let event: any;
    try {
      event = getStripe().webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      );
    } catch {
      return NextResponse.json({ message: "Webhook signature verification failed" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        await prisma.workspace.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: subscriptionId,
            plan: "PRO", // Will be updated by subscription.updated event
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price?.id;

        let plan: "STARTER" | "PRO" | "AGENCY" = "STARTER";
        if (priceId?.includes("pro")) plan = "PRO";
        if (priceId?.includes("agency")) plan = "AGENCY";

        await prisma.workspace.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        await prisma.workspace.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: "STARTER",
            stripeSubscriptionId: null,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
