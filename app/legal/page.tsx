import { FileText, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LegalPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32 text-center">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative">
          <Badge className="mb-6">Legal</Badge>
          <h1 className="text-4xl font-bold md:text-6xl">Policies for using ContentPilot</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Clear terms and privacy commitments for customers, teams, and developers.
          </p>
          <Link href="/auth/signup"><Button size="lg" className="mt-8">Start Trial</Button></Link>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 md:grid-cols-2">
          <Card className="hover-lift"><CardContent className="p-8"><LockKeyhole className="mb-5 h-8 w-8 text-primary" /><h2 className="text-2xl font-bold">Privacy Policy</h2><p className="mt-3 text-gray-600 dark:text-gray-400">How we collect, use, retain, and protect customer data.</p><Link href="/legal/privacy-policy"><Button className="mt-6">Read Privacy Policy</Button></Link></CardContent></Card>
          <Card className="hover-lift"><CardContent className="p-8"><FileText className="mb-5 h-8 w-8 text-primary" /><h2 className="text-2xl font-bold">Terms of Service</h2><p className="mt-3 text-gray-600 dark:text-gray-400">The rules and responsibilities that govern your account.</p><Link href="/legal/terms-of-service"><Button className="mt-6">Read Terms</Button></Link></CardContent></Card>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
