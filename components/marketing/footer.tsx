"use client";

import { Camera, Globe, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/marketing/container";

const footerGroups = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/api" },
    { label: "Solutions", href: "/solutions" },
  ],
  Company: [
    { label: "Company", href: "/company" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  Resources: [{ label: "Resources", href: "/resources" }],
  Legal: [
    { label: "Legal", href: "/legal" },
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms-of-service" },
  ],
};

const socialLinks = [
  { label: "Website", icon: Globe },
  { label: "Messages", icon: MessageCircle },
  { label: "Instagram", icon: Camera },
  { label: "Partners", icon: Link2 },
];

export function Footer() {
  return (
    <footer className="border-t border-light-border py-16 dark:border-dark-border">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="mt-4 text-sm text-dark-muted">
              AI-powered Facebook content management for modern businesses.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  href="/resources"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-dark-muted transition-colors hover:bg-primary/10 hover:text-primary dark:bg-white/5"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
          {Object.entries(footerGroups).map(([category, items]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-dark-muted transition-colors hover:text-gray-900 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-light-border pt-8 text-center text-sm text-dark-muted dark:border-dark-border">
          &copy; {new Date().getFullYear()} ContentPilot. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
