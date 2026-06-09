"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Wand2, Hash, RefreshCw, Lightbulb, CalendarDays,
  Copy, Edit, Library, Loader2, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const aiTabs = [
  { key: "posts", label: "Post Ideas", icon: Sparkles },
  { key: "captions", label: "Caption Writer", icon: Wand2 },
  { key: "hashtags", label: "Hashtag Generator", icon: Hash },
  { key: "rewriter", label: "Post Rewriter", icon: RefreshCw },
  { key: "cta", label: "CTA Generator", icon: Lightbulb },
  { key: "calendar", label: "Calendar Planner", icon: CalendarDays },
];

const tones = ["Professional", "Casual", "Humorous", "Inspirational", "Educational", "Promotional"];
const goals = ["Engagement", "Brand Awareness", "Lead Generation", "Sales", "Community Building"];

const demoResults = [
  {
    id: "1",
    text: "Did you know that 73% of marketers say AI has transformed their content strategy? Here are 5 ways you can leverage AI for your Facebook marketing today...\n\nThe future isn't coming. It's already here.",
    hashtags: ["#AIMarketing", "#SocialMedia", "#DigitalMarketing", "#ContentCreation", "#FacebookMarketing"],
    emoji: "🚀",
    engagementTip: "Post between 1-3 PM for maximum engagement. Use the question format to encourage comments.",
  },
  {
    id: "2",
    text: "STOP scrolling and START creating. 🛑\n\nYour audience is waiting for content that speaks to THEM. Not your competitors' audience. Not the generic masses. YOUR people.\n\nHere's a simple framework to create content that converts...",
    hashtags: ["#ContentStrategy", "#SocialMediaTips", "#MarketingTips", "#GrowthHacking", "#FacebookGrowth"],
    emoji: "🎯",
    engagementTip: "Posts with emojis get 57% more likes. The CAPS technique grabs attention in crowded feeds.",
  },
  {
    id: "3",
    text: "Monday Motivation: The brands that win on social media aren't the ones with the biggest budgets. They're the ones that show up consistently. 💪\n\nConsistency beats perfection every single time. What's one thing you'll commit to this week?",
    hashtags: ["#MondayMotivation", "#BrandBuilding", "#Consistency", "#SocialMediaMarketing", "#Entrepreneurship"],
    emoji: "💪",
    engagementTip: "Ending with a question increases comment rates by 162%. Monday posts perform well for motivational content.",
  },
];

export default function AIPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState(demoResults);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setResults(demoResults);
      setGenerating(false);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Content Assistant</h2>
        <p className="text-sm text-dark-muted">Generate engaging content with GPT-4o</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {aiTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configure Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Industry / Niche</label>
              <Input placeholder="e.g., Digital Marketing, E-commerce, Fitness..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Target Audience</label>
              <Input placeholder="e.g., Small business owners aged 25-45..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors"
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Goal</label>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Topic / Keywords</label>
              <Textarea placeholder="What should the posts be about?" className="min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Language</label>
                <select className="flex h-10 w-full rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Post Count</label>
                <Input type="number" min={1} max={10} defaultValue={3} />
              </div>
            </div>
            <Button onClick={handleGenerate} className="w-full gap-2" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Generated Content</h3>
            {results.length > 0 && (
              <Badge variant="secondary">{results.length} posts</Badge>
            )}
          </div>

          <AnimatePresence>
            {generating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <Sparkles className="h-12 w-12 text-primary relative animate-pulse" />
                </div>
                <p className="text-sm text-dark-muted mt-4">AI is crafting your content...</p>
              </motion.div>
            ) : (
              results.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover-lift">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{result.emoji}</span>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Copy">
                            <Copy className="h-3.5 w-3.5 text-dark-muted" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Edit">
                            <Edit className="h-3.5 w-3.5 text-dark-muted" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Add to Library">
                            <Library className="h-3.5 w-3.5 text-dark-muted" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Send to Composer">
                            <Send className="h-3.5 w-3.5 text-dark-muted" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-line mb-3">{result.text}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {result.hashtags.map((tag) => (
                          <span key={tag} className="text-xs text-primary">{tag}</span>
                        ))}
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Lightbulb className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">Engagement Tip</span>
                        </div>
                        <p className="text-xs text-dark-muted">{result.engagementTip}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
