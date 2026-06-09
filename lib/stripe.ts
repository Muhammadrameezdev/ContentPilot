import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2026-05-27.dahlia",
  });
}

export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 19,
    annualPrice: 15,
    pages: 3,
    posts: "100/mo",
    seats: 1,
    features: [
      "3 Facebook Pages",
      "100 posts per month",
      "AI Content Assistant",
      "Basic Analytics",
      "Email Support",
      "Content Calendar",
      "Post Scheduling",
    ],
  },
  PRO: {
    name: "Pro",
    price: 49,
    annualPrice: 39,
    pages: 15,
    posts: "Unlimited",
    seats: 3,
    features: [
      "15 Facebook Pages",
      "Unlimited posts",
      "AI Content Assistant",
      "Advanced Analytics",
      "Priority Support",
      "Team Collaboration (3 seats)",
      "Approval Workflows",
      "Custom Scheduling",
      "Bulk Upload",
    ],
    popular: true,
  },
  AGENCY: {
    name: "Agency",
    price: 129,
    annualPrice: 103,
    pages: "Unlimited",
    posts: "Unlimited",
    seats: 10,
    features: [
      "Unlimited Facebook Pages",
      "Unlimited posts",
      "AI Content Assistant",
      "Enterprise Analytics",
      "Dedicated Support",
      "Team Collaboration (10 seats)",
      "Approval Workflows",
      "White-label Options",
      "API Access",
      "Custom Integrations",
      "Priority Queue",
    ],
  },
} as const;

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return getStripe().checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomer(email: string, name: string) {
  return getStripe().customers.create({ email, name });
}

export async function cancelSubscription(subscriptionId: string) {
  return getStripe().subscriptions.cancel(subscriptionId);
}

export async function getInvoices(customerId: string) {
  return getStripe().invoices.list({ customer: customerId, limit: 20 });
}
