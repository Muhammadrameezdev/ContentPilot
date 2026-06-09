import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  ["Acceptance of Terms", "By creating an account or using ContentPilot, you agree to these terms and any policies incorporated by reference."],
  ["Account Responsibility", "You are responsible for maintaining accurate account information, safeguarding credentials, managing team access, and all activity under your workspace."],
  ["Acceptable Use", "You may not misuse the service, violate Meta platform policies, send unlawful content, attempt unauthorized access, disrupt infrastructure, or use automation in abusive ways."],
  ["Intellectual Property", "You retain ownership of your content. ContentPilot retains ownership of the platform, software, branding, documentation, and service technology."],
  ["Termination", "You may cancel your account at any time. We may suspend or terminate access for non-payment, security risk, policy violations, or unlawful use."],
  ["Disclaimers", "The service is provided as available. We do not guarantee uninterrupted availability, specific social media outcomes, or that third-party platform behavior will remain unchanged."],
  ["Governing Law", "These terms are governed by the laws applicable to the contracting ContentPilot entity, without regard to conflict of law principles."],
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">Terms</Badge>
          <h1 className="max-w-4xl text-4xl font-bold md:text-6xl">Terms of Service</h1>
          <p className="mt-6 max-w-2xl text-gray-600 dark:text-gray-400">
            Effective June 5, 2026. These terms govern access to and use of ContentPilot.
          </p>
          <Link href="/auth/signup"><Button size="lg" className="mt-8">Start Trial</Button></Link>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-4xl">
          <Card>
            <CardContent className="space-y-8 p-8 md:p-10">
              {sections.map(([title, copy]) => (
                <section key={title}>
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">{copy}</p>
                </section>
              ))}
            </CardContent>
          </Card>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
