"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Container } from "@/components/marketing/container";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const plans = [
  {
    name: "Starter",
    tip: "Best for solo creators getting started",
    price: 19,
    annualPrice: 15,
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
  {
    name: "Pro",
    tip: "Best for growing agencies",
    price: 49,
    annualPrice: 39,
    popular: true,
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
  },
  {
    name: "Agency",
    tip: "Best for multi-brand teams at scale",
    price: 129,
    annualPrice: 103,
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
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24">
      <Container>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeInUp} className="mb-4 text-3xl font-bold md:text-4xl">
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="mb-8 text-dark-muted">
            Start free. Upgrade when you&apos;re ready.
          </motion.p>

          <motion.div variants={fadeInUp} className="mb-12 flex items-center justify-center gap-3">
            <span className={cn("text-sm", !annual && "font-semibold")}>Monthly</span>
            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                annual ? "bg-primary" : "bg-gray-300 dark:bg-dark-border"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  annual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm", annual && "font-semibold")}>
              Annual <span className="text-xs text-success">(Save 20%)</span>
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={cn(
                  "relative rounded-card border p-8 hover-lift",
                  plan.popular
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 dark:bg-primary/5"
                    : "border-light-border bg-white dark:border-dark-border dark:bg-dark-surface"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <Tooltip content={plan.tip}>
                  <h3 className="mb-2 inline-flex cursor-help text-xl font-bold">{plan.name}</h3>
                </Tooltip>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-dark-muted">/mo</span>
                </div>
                <ul className="mb-8 space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
