"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/auth/verify-email", { method: "POST" });
      if (res.ok) {
        toast.success("Verification email sent!");
        setCooldown(60);
        const interval = setInterval(() => {
          setCooldown((c) => {
            if (c <= 1) {
              clearInterval(interval);
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      }
    } catch {
      toast.error("Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-8 shadow-glass text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
          <p className="text-sm text-dark-muted mb-6">
            We&apos;ve sent a verification email to your inbox. Please click the
            link to verify your account.
          </p>
          <Button
            onClick={handleResend}
            variant="outline"
            disabled={resending || cooldown > 0}
            className="mb-4"
          >
            {resending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend Verification Email"}
          </Button>
          <p className="text-sm text-dark-muted">
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
