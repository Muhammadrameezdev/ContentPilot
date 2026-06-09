import { CalendarCheck, Flag, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const milestones = [
  ["Founding", Flag, "Built after an agency team lost too many Friday afternoons to manual Facebook scheduling."],
  ["Beta", Sparkles, "Early marketers shaped smart queues, approvals, and reporting into the first private beta."],
  ["Launch", Rocket, "ContentPilot launched with AI-assisted planning and official Meta API publishing."],
  ["Scale", CalendarCheck, "Growing teams now use the platform to manage creators, clients, campaigns, and reporting."],
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">About</Badge>
          <h1 className="max-w-4xl text-4xl font-bold md:text-6xl">Built by marketers, for marketers</h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            ContentPilot started as an internal fix for a simple problem: the teams closest to the brand were spending more time operating content calendars than creating useful content.
          </p>
          <Link href="/auth/signup"><Button size="lg" className="mt-8">Start Trial</Button></Link>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card><CardContent className="p-8 md:p-10"><p className="text-lg leading-8 text-gray-700 dark:text-gray-300">We built the product around the real rhythm of marketing work: drafts that need approval, posts that need timing, clients who need reports, and audiences that reward consistency. The result is a focused hub for Facebook teams that want less operational drag and more creative energy.</p></CardContent></Card>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <h2 className="mb-10 text-3xl font-bold">Timeline</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {milestones.map(([title, Icon, copy]) => (
              <Card key={title} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Icon className="mb-5 h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
