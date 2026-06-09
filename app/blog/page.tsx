"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/marketing/container";
import { Section } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const posts = [
  {
    title: "How to Build a 30-Day Facebook Content Calendar",
    excerpt: "A practical framework for turning campaign goals into a month of scheduled posts.",
    author: "Maya Chen",
    date: "June 4, 2026",
    readTime: "7 min read",
    category: "Strategy",
  },
  {
    title: "What Agencies Should Automate First",
    excerpt: "Start with the workflows that remove client chaos without hiding important approvals.",
    author: "Omar Ruiz",
    date: "May 28, 2026",
    readTime: "5 min read",
    category: "Agencies",
  },
  {
    title: "Reading Facebook Analytics Without Drowning in Metrics",
    excerpt: "Focus on the signals that connect publishing consistency to business outcomes.",
    author: "Leah Grant",
    date: "May 19, 2026",
    readTime: "6 min read",
    category: "Analytics",
  },
];

const categories = ["All", "Strategy", "Agencies", "Analytics"];

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery = `${post.title} ${post.excerpt} ${post.author}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 mesh-gradient" />
        <Container className="relative text-center">
          <Badge className="mb-6">Blog</Badge>
          <h1 className="text-4xl font-bold md:text-6xl">Facebook growth playbooks for modern teams</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Strategy, automation, analytics, and team workflows from the ContentPilot crew.
          </p>
          <Link href="/auth/signup"><Button size="lg" className="mt-8">Start Trial</Button></Link>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-muted" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts" className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "rounded-badge border px-3 py-2 text-sm transition-colors",
                    category === item
                      ? "border-primary bg-primary text-white"
                      : "border-light-border text-dark-muted hover:text-primary dark:border-dark-border"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <Card key={post.title} className="overflow-hidden hover-lift">
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/20 via-accent/10 to-success/10 p-5">
                  <div className="h-full rounded-card border border-white/20 bg-white/20 dark:bg-dark-surface/40" />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4">{post.category}</Badge>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                  <div className="mt-6 text-xs text-dark-muted">
                    {post.author} · {post.date} · {post.readTime}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPosts.length === 0 && (
              <Card className="md:col-span-3">
                <CardContent className="p-8 text-center text-dark-muted">
                  No posts match that search yet.
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
