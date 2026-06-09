import { BookOpen, Code2, History, MessageCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const resources = [
  ["Getting Started Guide", BookOpen, "Connect your first page, invite your team, and publish your first scheduled post."],
  ["Video Tutorials", PlayCircle, "Short walkthroughs for calendars, queues, analytics, and automation rules."],
  ["API Documentation", Code2, "Developer references for Bearer tokens, endpoints, limits, and webhook flows."],
  ["Community Forum", MessageCircle, "Trade templates, workflows, and campaign ideas with other Facebook marketers."],
  ["Changelog", History, "Follow product updates, reliability improvements, and new automation releases."],
] as const;

export default function ResourcesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32 text-center">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">Resources</Badge>
          <h1 className="text-4xl font-bold md:text-6xl">Help for every stage of your workflow</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Guides, tutorials, API references, community support, and product updates in one place.
          </p>
          <Link href="/auth/signup"><Button size="lg" className="mt-8">Start Trial</Button></Link>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map(([title, Icon, copy]) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{copy}</p>
                  <Button variant="outline" className="mt-6">Open Resource</Button>
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
