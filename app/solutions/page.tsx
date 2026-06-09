import { Building2, Check, Crown, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const solutions = [
  ["Content Creators", Users, ["Schedule posts around your content calendar", "Grow with consistent publishing", "Monetize audience momentum"]],
  ["Marketing Agencies", Building2, ["Manage 50+ pages from one hub", "Send white-label reports", "Control approvals by client"]],
  ["eCommerce Brands", ShoppingBag, ["Automate product post campaigns", "Connect content to sales goals", "Promote drops and offers on time"]],
  ["Enterprise Teams", Crown, ["SSO-ready team controls", "Audit logs for publishing governance", "Dedicated support for launches"]],
] as const;

export default function SolutionsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32 text-center">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">Solutions</Badge>
          <h1 className="text-4xl font-bold md:text-6xl">Solutions Built for Every Team</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Whether you publish for one audience or hundreds of client pages, ContentPilot adapts to your operating model.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {solutions.map(([title, Icon, benefits]) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <ul className="mt-5 space-y-3">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button className="mt-6">Start Trial</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid border-b border-light-border p-6 dark:border-dark-border md:grid-cols-3">
                <h2 className="text-2xl font-bold">Why ContentPilot</h2>
                <div className="font-semibold text-primary">ContentPilot</div>
                <div className="font-semibold text-dark-muted">Generic tools</div>
              </div>
              {[
                ["Facebook-first scheduling", "Native page workflows", "Generic calendar queues"],
                ["Agency reporting", "White-label and client-ready", "Manual exports"],
                ["Automation depth", "Rules, replies, retries", "Basic scheduled posts"],
                ["Team governance", "Roles, logs, approvals", "Shared logins"],
              ].map((row) => (
                <div key={row[0]} className="grid gap-3 border-b border-light-border p-6 last:border-0 dark:border-dark-border md:grid-cols-3">
                  <div className="font-medium">{row[0]}</div>
                  <div className="text-gray-600 dark:text-gray-300">{row[1]}</div>
                  <div className="text-gray-500 dark:text-dark-muted">{row[2]}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="mt-10 rounded-card border border-light-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
            <p className="mb-5 text-center text-sm font-medium text-dark-muted">Trusted by growing teams at</p>
            <div className="grid grid-cols-2 gap-4 text-center text-sm font-bold text-gray-500 dark:text-gray-400 md:grid-cols-5">
              {["Northstar Retail", "BluePeak Media", "MarketForge", "NovaCart", "Atlas Social"].map((logo) => (
                <div key={logo} className="rounded-card bg-gray-50 px-3 py-4 dark:bg-white/5">{logo}</div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
