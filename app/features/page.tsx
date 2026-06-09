"use client";

import { BarChart3, Bot, CalendarClock, HelpCircle, Layers } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";

const features = [
  {
    icon: CalendarClock,
    title: "AI Content Scheduling",
    tip: "Smart queues learn when your audience is most likely to engage.",
    body: [
      "Build a publishing rhythm without watching the clock. ContentPilot fills your smart queue with ready-to-review posts and recommends posting windows based on account history.",
      "Optimal timing keeps evergreen content moving while campaigns, launches, and seasonal posts stay pinned to the moments that matter.",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    tip: "Track reach, engagement, and conversion signals in one view.",
    body: [
      "See what is working across reach, reactions, comments, shares, clicks, and downstream conversion events. The dashboard turns Facebook performance into decisions your team can act on.",
      "Compare pages, campaigns, and content formats without exporting spreadsheets or stitching reports together by hand.",
    ],
  },
  {
    icon: Bot,
    title: "Automation Tools",
    tip: "Use rules, auto-replies, and workflows to remove repetitive work.",
    body: [
      "Create automation rules for approvals, failed posts, engagement spikes, and common customer replies. Teams can move faster without giving up control.",
      "Workflow steps keep content moving from draft to scheduled to published with clear ownership at every stage.",
    ],
  },
  {
    icon: Layers,
    title: "Multi-Account Management",
    tip: "Switch accounts, assign roles, and manage client workspaces cleanly.",
    body: [
      "Manage multiple Facebook pages, brands, and client workspaces from one command center. Role-based access keeps creators, editors, and stakeholders focused on their lane.",
      "Account switching is fast, audit-friendly, and built for teams that cannot afford cross-client confusion.",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative text-center">
          <Badge className="mb-6">Feature Suite</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Everything You Need to Dominate Facebook
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Plan, publish, analyze, and automate content across every page your team manages.
          </p>
          <Link href="/auth/signup" className="mt-10 inline-block">
            <Button size="lg">Start Trial</Button>
          </Link>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-8">
          {features.map((feature) => (
            <Card key={feature.title} className="overflow-hidden hover-lift">
              <CardContent className="grid gap-8 p-8 md:grid-cols-[220px_1fr] md:p-10">
                <div>
                  <Tooltip content={feature.tip}>
                    <div className="mb-5 flex h-14 w-14 cursor-help items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-7 w-7" />
                    </div>
                  </Tooltip>
                  <Tooltip content={feature.tip}>
                    <h2 className="inline-flex cursor-help items-center gap-2 text-2xl font-bold">
                      {feature.title}
                      <HelpCircle className="h-4 w-4 text-dark-muted" />
                    </h2>
                  </Tooltip>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  {feature.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
