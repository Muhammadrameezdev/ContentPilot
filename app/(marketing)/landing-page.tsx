//my original code file with correct styling of "start free trial "  and light and dark theme toggle icon 

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  X,
  Clock,
  TrendingDown,
  Briefcase,
  Brain,
  CalendarDays,
  BarChart3,
  Star,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  Globe,
  MessageCircle,
  Camera,
  Link2,
} from "lucide-react";
import { Navbar as MarketingNavbar } from "@/components/marketing/navbar";
import { Footer as MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// --- NAV ---
function Navbar() {
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Solutions", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {item}
              </a>
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

// --- HERO ---
function HeroSection({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Content Management
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold max-w-5xl mx-auto leading-tight"
          >
            Fill Your Facebook Pages with Engaging Content —{" "}
            <span className="gradient-text">100% on Autopilot</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Stop wasting hours on manual posting. Create, schedule, and automate
            your entire Facebook strategy in minutes with AI-driven content
            management.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/signup">
              <Button size="xl" className="gap-2 group">
                Start Your Free 14-Day Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="xl" variant="outline" className="gap-2" onClick={onOpenDemo}>
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white dark:border-dark-bg"
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Trusted by <strong className="text-gray-900 dark:text-white">5,000+</strong> businesses
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-warning text-warning"
                />
              ))}
            </div>
          </motion.div>

          {/* Animated Mockup */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-xl overflow-hidden border border-light-border dark:border-dark-border shadow-2xl dark:shadow-glass">
              <div className="bg-white dark:bg-dark-surface p-1">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-light-border dark:border-dark-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-dark-muted">
                    FB Content Hub — Dashboard
                  </div>
                </div>
                <div className="aspect-[16/9] bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface relative overflow-hidden">
                  <div className="absolute inset-0 flex">
                    {/* Sidebar mockup */}
                    <div className="w-16 bg-dark-surface border-r border-dark-border flex flex-col items-center py-4 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={cn("w-8 h-8 rounded-lg", i === 1 ? "bg-primary/20" : "bg-dark-border")} />
                      ))}
                    </div>
                    {/* Content area mockup */}
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {["#6366F1", "#06B6D4", "#10B981", "#F59E0B"].map((color, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="h-20 rounded-lg border border-dark-border p-3"
                            style={{ backgroundColor: `${color}10` }}
                          >
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: `${color}30` }} />
                            <div className="mt-2 h-3 w-12 rounded" style={{ backgroundColor: `${color}20` }} />
                          </motion.div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-48 rounded-lg border border-dark-border bg-dark-surface/50 p-4">
                          <div className="flex justify-between mb-4">
                            <div className="h-3 w-24 bg-dark-border rounded" />
                            <div className="h-3 w-16 bg-dark-border rounded" />
                          </div>
                          {/* Animated chart bars */}
                          <div className="flex items-end gap-2 h-28">
                            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 1 + i * 0.05, duration: 0.5 }}
                                className="flex-1 bg-primary/40 rounded-t"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="h-48 rounded-lg border border-dark-border bg-dark-surface/50 p-4 space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.5 + i * 0.1 }}
                              className="flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-lg bg-dark-border" />
                              <div className="flex-1">
                                <div className="h-2.5 w-full bg-dark-border rounded mb-1.5" />
                                <div className="h-2 w-2/3 bg-dark-border/50 rounded" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- PAIN POINTS ---
function PainPointSection() {
  const pains = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "You miss peak posting hours",
      desc: "By the time you remember to post, the algorithm has already moved on.",
    },
    {
      icon: <TrendingDown className="h-6 w-6" />,
      title: "Organic reach keeps dropping",
      desc: "Inconsistent posting kills your visibility. The algorithm rewards consistency.",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Manual scheduling feels like a 2nd job',
      desc: "Copy-pasting, formatting, uploading — hours wasted every single week.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Consistency is King.{" "}
            <span className="text-dark-muted">But Consistency is Exhausting.</span>
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {pains.map((pain, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group p-6 rounded-card border border-red-200/50 dark:border-red-500/10 bg-red-50/50 dark:bg-red-500/5 hover-lift"
              >
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-error mb-4">
                  {pain.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{pain.title}</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">
                  {pain.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- BENEFITS ---
function BenefitsSection() {
  const benefits = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Never Stare at a Blank Screen",
      desc: "AI generates captions, ideas, hashtags tailored to your niche in seconds.",
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: <CalendarDays className="h-8 w-8" />,
      title: "Set It and Forget It",
      desc: "Build a month of content in one afternoon, auto-published at peak hours.",
      color: "from-accent/20 to-accent/5",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Maximize Organic Reach",
      desc: "Consistent posting trains the algorithm to favor your page.",
      color: "from-success/20 to-success/5",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Put Your Facebook Marketing on{" "}
            <span className="gradient-text">Cruise Control</span>
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="grid md:grid-cols-3 gap-8 mt-12"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={cn(
                  "group p-8 rounded-card bg-gradient-to-br",
                  benefit.color,
                  "border border-light-border dark:border-dark-border hover-lift"
                )}
              >
                <div className="w-16 h-16 rounded-xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-primary mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-dark-muted">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FEATURES ---
function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      name: "Smart Calendar",
      icon: <CalendarDays className="h-5 w-5" />,
      desc: "Drag-and-drop content calendar with month, week, and day views. See all your scheduled posts at a glance.",
      features: ["Drag & Drop Scheduling", "Color-coded by Page", "Multi-view (Month/Week/Day)", "Quick Create from Calendar"],
    },
    {
      name: "AI Assistant",
      icon: <Sparkles className="h-5 w-5" />,
      desc: "Generate engaging posts, captions, and hashtags powered by GPT-4o. Never run out of content ideas.",
      features: ["Post Generation", "Caption Writer", "Hashtag Generator", "Content Rewriter"],
    },
    {
      name: "Multi-Page",
      icon: <Layers className="h-5 w-5" />,
      desc: "Manage all your Facebook Pages from one dashboard. Connect, monitor, and publish across pages effortlessly.",
      features: ["One-click Connect", "Health Monitoring", "Token Management", "Per-page Analytics"],
    },
    {
      name: "Auto Queue",
      icon: <Clock className="h-5 w-5" />,
      desc: "Set up your publishing queue and let the system handle the rest. Smart rate limiting and retry logic built-in.",
      features: ["Kanban Board", "Priority Ordering", "Auto-retry Failed", "Rate Limiting"],
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      desc: "Deep insights into your content performance. Track reach, engagement, and find the best posting times.",
      features: ["Reach & Impressions", "Engagement Breakdown", "Best Posting Times", "Page Comparison"],
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-center mb-4"
          >
            Everything You Need.{" "}
            <span className="text-dark-muted">Nothing You Don&apos;t.</span>
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-2 mt-12"
          >
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                  activeTab === i
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                )}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12 grid md:grid-cols-2 gap-8 items-center"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  {tabs[activeTab].name}
                </h3>
                <p className="text-gray-600 dark:text-dark-muted mb-6">
                  {tabs[activeTab].desc}
                </p>
                <ul className="space-y-3">
                  {tabs[activeTab].features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-light-border dark:border-dark-border bg-gradient-to-br from-dark-surface to-dark-bg shadow-glass">
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="text-6xl opacity-10">
                    {tabs[activeTab].icon}
                  </div>
                </div>
                <div className="absolute inset-0 p-6">
                  <div className="h-3 w-32 bg-white/10 rounded mb-4" />
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="h-16 rounded-lg bg-white/5 border border-white/5"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// --- TESTIMONIALS ---
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah K.",
      role: "E-commerce Owner",
      quote: "Saved me 10 hours a week. My page went from 2K to 18K followers in 3 months.",
      rating: 5,
    },
    {
      name: "Marcus T.",
      role: "Social Media Agency",
      quote: "Managing 12 client pages used to be chaos. Now it takes 2 hours a week.",
      rating: 5,
    },
    {
      name: "Priya M.",
      role: "Content Creator",
      quote: "The AI captions alone are worth the subscription. Game-changer for my workflow.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-12">
            Loved by{" "}
            <span className="gradient-text">5,000+ Business Owners</span> and
            Creators
          </motion.h2>
          <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 rounded-card border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface hover-lift"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-dark-muted">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- PRICING ---
function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: "Starter",
      price: 19,
      annualPrice: 15,
      features: [
        "3 Facebook Pages",
        "100 posts per month",
        "AI Content Assistant",
        "Basic Analytics",
        "Email Support",
        "Content Calendar",
        "Post Scheduling",
      ],
    },
    {
      name: "Pro",
      price: 49,
      annualPrice: 39,
      popular: true,
      features: [
        "15 Facebook Pages",
        "Unlimited posts",
        "AI Content Assistant",
        "Advanced Analytics",
        "Priority Support",
        "Team Collaboration (3 seats)",
        "Approval Workflows",
        "Custom Scheduling",
        "Bulk Upload",
      ],
    },
    {
      name: "Agency",
      price: 129,
      annualPrice: 103,
      features: [
        "Unlimited Facebook Pages",
        "Unlimited posts",
        "AI Content Assistant",
        "Enterprise Analytics",
        "Dedicated Support",
        "Team Collaboration (10 seats)",
        "Approval Workflows",
        "White-label Options",
        "API Access",
        "Custom Integrations",
        "Priority Queue",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-dark-muted mb-8">
            Start free. Upgrade when you&apos;re ready.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-12">
            <span className={cn("text-sm", !annual && "font-semibold")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                annual ? "bg-primary" : "bg-gray-300 dark:bg-dark-border"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  annual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm", annual && "font-semibold")}>
              Annual{" "}
              <span className="text-success text-xs">(Save 20%)</span>
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={cn(
                  "relative p-8 rounded-card border hover-lift",
                  plan.popular
                    ? "border-primary bg-primary/5 dark:bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-light-border dark:border-dark-border bg-white dark:bg-dark-surface"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-dark-muted">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FAQ ---
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Will this get my Facebook account banned or flagged?",
      a: "Absolutely not. FB Content Hub uses the official Meta Graph API, which is the approved method for publishing content. We follow all of Meta's platform policies and rate limits. Your account is completely safe.",
    },
    {
      q: "Can I schedule video reels and carousels too?",
      a: "Yes! FB Content Hub supports all major content types including text posts, images, video posts, Facebook Reels, link shares, and carousels. Simply upload your media and schedule away.",
    },
    {
      q: "Do I need tech skills to set this up?",
      a: "Not at all. Connecting your Facebook Pages takes about 30 seconds. Just log in with Facebook, select your pages, and you're ready to go. The AI assistant and drag-and-drop calendar make content management intuitive for everyone.",
    },
    {
      q: "How does the AI content generation work?",
      a: "Our AI is powered by GPT-4o. Simply tell it your niche, target audience, and preferred tone, and it generates engaging post captions, hashtags, and ideas specifically for your brand. You can edit, regenerate, or use the content as-is.",
    },
    {
      q: "Can I manage multiple business pages?",
      a: "Absolutely. That's one of our core features. Depending on your plan, you can manage 3 to unlimited Facebook Pages, all from one dashboard. Perfect for agencies and multi-brand businesses.",
    },
    {
      q: "What happens after my free trial ends?",
      a: "After your 14-day free trial, you can choose a plan that fits your needs. If you decide not to continue, your account will be downgraded to a limited free tier. We'll never charge you without your explicit consent.",
    },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div variants={fadeInUp} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="border border-light-border dark:border-dark-border rounded-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex items-center justify-between w-full p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-dark-muted shrink-0 transition-transform",
                      open === i && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-gray-600 dark:text-dark-muted">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FINAL CTA ---
function FinalCTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl p-12 md:p-20 text-center"
        >
          <div className="absolute inset-0 mesh-gradient bg-dark-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Claim Back Your Free Time?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of brands automating their growth today. No credit
              card required.
            </p>
            <Link href="/auth/signup">
              <Button size="xl" className="gap-2 group">
                Start Automating for Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FOOTER ---
function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Integrations", "Changelog", "API"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Help Center", "Community", "Status"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer className="border-t border-light-border dark:border-dark-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="mt-4 text-sm text-dark-muted">
              AI-powered Facebook content management for modern businesses.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Globe, MessageCircle, Camera, Link2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-dark-muted hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border text-center text-sm text-dark-muted">
          &copy; {new Date().getFullYear()} FB Content Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// --- MAIN PAGE ---
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection onOpenDemo={function (): void {
        throw new Error("Function not implemented.");
      }} />
      <PainPointSection />
      <BenefitsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}