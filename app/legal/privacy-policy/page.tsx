import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  ["Data We Collect", "We collect account details, workspace information, connected Facebook page metadata, scheduled content, publishing status, usage events, billing records, and support communications needed to operate ContentPilot."],
  ["How We Use It", "We use data to provide scheduling, analytics, automation, team collaboration, customer support, fraud prevention, billing, product improvement, and service reliability."],
  ["Cookies", "We use essential cookies for authentication and security, plus limited analytics cookies to understand product usage and improve performance."],
  ["Third Parties", "We work with trusted providers for authentication, hosting, payments, email delivery, analytics, and official Meta platform integrations. These providers process data only for authorized service purposes."],
  ["Your Rights", "Depending on your location, you may request access, correction, deletion, export, restriction, or objection to certain processing of your personal data."],
  ["Data Retention", "We retain account and workspace data while your account is active, then delete or anonymize it after a reasonable period unless retention is required for legal, security, or billing reasons."],
  ["Contact Us", "For privacy requests, contact privacy@contentpilot.com. We will verify your request and respond within the timeframe required by applicable law."],
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">Privacy</Badge>
          <h1 className="max-w-4xl text-4xl font-bold md:text-6xl">Privacy Policy</h1>
          <p className="mt-6 max-w-2xl text-gray-600 dark:text-gray-400">
            Effective June 5, 2026. This policy explains how ContentPilot handles personal data for our SaaS platform.
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
