"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "/features", tip: "Explore all platform features" },
  { label: "Pricing", href: "/pricing", tip: "Compare plans and included limits" },
  { label: "Solutions", href: "/solutions", tip: "Find workflows for your team type" },
  { label: "FAQ", href: "/#faq", tip: "Get answers to common questions" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-light-border bg-white/80 shadow-sm backdrop-blur-xl dark:border-dark-border dark:bg-dark-bg/80"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="ContentPilot home">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Tooltip key={item.href} content={item.tip} side="bottom">
                <Link
                  href={item.href}
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              </Tooltip>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
