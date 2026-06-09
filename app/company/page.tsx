import { Heart, Lightbulb, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values: Array<{ title: string; icon: LucideIcon; copy: string }> = [
  { title: "Clarity", icon: Lightbulb, copy: "We turn noisy social workflows into obvious next steps." },
  { title: "Trust", icon: ShieldCheck, copy: "We build around official APIs, clear roles, and dependable publishing." },
  { title: "Momentum", icon: Heart, copy: "We help teams keep showing up when the week gets busy." },
];

export default function CompanyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative text-center">
          <Badge className="mb-6">Company</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold md:text-6xl">
            We help teams turn Facebook content into a dependable growth engine.
          </h1>
          <Link href="/auth/signup">
            <Button size="lg" className="mt-8">Start Trial</Button>
          </Link>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 md:grid-cols-2">
          <Card><CardContent className="p-8"><h2 className="text-2xl font-bold">Our Mission</h2><p className="mt-4 text-gray-600 dark:text-gray-300">Make professional Facebook publishing accessible to creators, operators, agencies, and brand teams without forcing them into slow enterprise tooling.</p></CardContent></Card>
          <Card><CardContent className="p-8"><h2 className="text-2xl font-bold">The Problem We Solve</h2><p className="mt-4 text-gray-600 dark:text-gray-300">Most teams know consistency matters, but manual planning, posting, approvals, and reporting drain the hours that should go into creative work.</p></CardContent></Card>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <h2 className="mb-8 text-3xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ title, icon: Icon, copy }) => (
              <Card key={title}><CardContent className="p-6"><Icon className="mb-4 h-8 w-8 text-primary" /><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{copy}</p></CardContent></Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <h2 className="mb-8 text-3xl font-bold">The Team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {["Maya Chen - Product Lead", "Omar Ruiz - Engineering Lead", "Leah Grant - Customer Strategy"].map((member) => (
              <Card key={member}><CardContent className="p-6 text-center"><div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent" /><h3 className="font-bold">{member.split(" - ")[0]}</h3><p className="text-sm text-dark-muted">{member.split(" - ")[1]}</p><Users className="mx-auto mt-4 h-5 w-5 text-primary" /></CardContent></Card>
            ))}
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
