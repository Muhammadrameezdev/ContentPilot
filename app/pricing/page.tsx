import { Check, X } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const rows = [
  ["# of Pages", "3 pages", "15 pages", "Unlimited"],
  ["Scheduled Posts/mo", "100", "Unlimited", "Unlimited"],
  ["Analytics", "Basic", "Advanced", "Enterprise"],
  ["API Access", false, true, true],
  ["Multi-Account", false, true, true],
  ["Priority Support", false, true, "Dedicated"],
  ["Custom Branding", false, true, true],
  ["White Label", false, false, true],
] as const;

const headingTips: Record<string, string> = {
  Starter: "Best for solo creators getting started",
  Pro: "Best for growing agencies",
  Agency: "Best for multi-brand teams at scale",
};

const rowTips: Record<string, string> = {
  "# of Pages": "Number of Facebook pages you can connect",
  "Scheduled Posts/mo": "Monthly posts available for scheduled publishing",
  Analytics: "Reporting depth available in the dashboard",
  "API Access": "Full REST API with webhooks",
  "Multi-Account": "Manage multiple accounts and client workspaces",
  "Priority Support": "Faster response times from the support team",
  "Custom Branding": "Customize workspace branding for your team",
  "White Label": "Remove ContentPilot branding for clients",
};

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-success" />;
  if (value === false) return <X className="mx-auto h-5 w-5 text-error" />;
  return <span>{value}</span>;
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32 text-center">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">Plans</Badge>
          <h1 className="text-4xl font-bold md:text-6xl">Pricing that scales with your pages</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Start lean, grow into advanced automation, and bring every brand or client page with you.
          </p>
          <Link href="/auth/signup" className="mt-8 inline-block">
            <Button size="lg">Start Trial</Button>
          </Link>
        </Container>
      </Section>

      <PricingCards />

      <Section className="pt-0">
        <Container>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="sticky top-16 z-10 bg-white dark:bg-dark-surface">
                  <tr className="border-b border-light-border dark:border-dark-border">
                    {["Feature", "Starter", "Pro", "Agency"].map((heading) => (
                      <th
                        key={heading}
                        className={cn(
                          "px-5 py-4 font-semibold",
                          heading === "Pro" && "bg-primary/10 text-primary"
                        )}
                      >
                        {headingTips[heading] ? (
                          <Tooltip content={headingTips[heading]} side="bottom">
                            <span className="inline-flex cursor-help items-center">
                              {heading}
                              {heading === "Pro" && (
                                <span className="ml-2 rounded-badge bg-primary px-2 py-0.5 text-xs text-white">
                                  Recommended
                                </span>
                              )}
                            </span>
                          </Tooltip>
                        ) : (
                          heading
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row[0]}
                      className={cn(
                        "border-b border-light-border last:border-0 dark:border-dark-border",
                        index % 2 === 0 && "bg-gray-50/70 dark:bg-white/[0.03]"
                      )}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${row[0]}-${cellIndex}`}
                          className={cn(
                            "px-5 py-4",
                            cellIndex === 0 && "font-medium",
                            cellIndex === 2 && "bg-primary/5 text-center",
                            cellIndex > 0 && cellIndex !== 2 && "text-center"
                          )}
                        >
                          <Tooltip content={rowTips[row[0]]} side="top">
                            <span className="inline-flex min-h-5 cursor-help items-center justify-center">
                              <CellValue value={cell} />
                            </span>
                          </Tooltip>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
