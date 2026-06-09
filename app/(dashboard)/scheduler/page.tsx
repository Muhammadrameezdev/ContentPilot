"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, Clock, Globe, Upload, Plus, FileText,
  ChevronRight, CheckCircle, Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const workflowSteps = [
  { label: "Draft", status: "completed" },
  { label: "Review", status: "current" },
  { label: "Scheduled", status: "upcoming" },
  { label: "Publishing", status: "upcoming" },
  { label: "Published", status: "upcoming" },
];

const pages = [
  { id: "1", name: "Tech Insights", followers: "18.5K" },
  { id: "2", name: "Marketing Pro", followers: "9.2K" },
  { id: "3", name: "Brand Hub", followers: "5.4K" },
  { id: "4", name: "Creative Studio", followers: "12.3K" },
];

export default function SchedulerPage() {
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"single" | "bulk" | "recurring">("single");

  const togglePage = (id: string) => {
    setSelectedPages((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Post Scheduler</h2>
        <p className="text-sm text-dark-muted">Schedule content for publishing</p>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-2">
                  {step.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : step.status === "current" ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20" />
                  ) : (
                    <Circle className="h-5 w-5 text-dark-border" />
                  )}
                  <span className={cn("text-sm font-medium", step.status === "upcoming" && "text-dark-muted")}>
                    {step.label}
                  </span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-dark-muted mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Type Tabs */}
      <div className="flex gap-2">
        {[
          { key: "single" as const, label: "Single Post", icon: FileText },
          { key: "bulk" as const, label: "Bulk Schedule", icon: Upload },
          { key: "recurring" as const, label: "Recurring", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setScheduleType(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-input text-sm font-medium transition-all",
              scheduleType === tab.key
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduleType === "bulk" ? (
                <div className="border-2 border-dashed border-light-border dark:border-dark-border rounded-card p-8 text-center">
                  <Upload className="h-8 w-8 text-dark-muted mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Upload CSV File</p>
                  <p className="text-xs text-dark-muted mb-4">
                    CSV with columns: content, page, date, time
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button size="sm">Choose File</Button>
                    <Button size="sm" variant="outline">Download Template</Button>
                  </div>
                </div>
              ) : (
                <>
                  <Textarea placeholder="Write your post content..." className="min-h-[150px]" />
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-3 w-3" /> Add Media
                    </Button>
                    <Button variant="outline" size="sm">Insert Emoji</Button>
                    <div className="ml-auto text-xs text-dark-muted">0 / 63,206 characters</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time</label>
                  <Input type="time" />
                </div>
                {scheduleType === "recurring" && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Repeat</label>
                      <select className="flex h-10 w-full rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">End Date</label>
                      <Input type="date" />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium mb-1.5 block">Timezone</label>
                <select className="flex h-10 w-full rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm">
                  <option>UTC (GMT+0)</option>
                  <option>EST (GMT-5)</option>
                  <option>PST (GMT-8)</option>
                  <option>IST (GMT+5:30)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Pages */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Target Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => togglePage(page.id)}
                    className={cn(
                      "flex items-center gap-3 w-full p-3 rounded-input border transition-all text-left",
                      selectedPages.includes(page.id)
                        ? "border-primary bg-primary/5"
                        : "border-light-border dark:border-dark-border hover:border-primary/50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{page.name}</div>
                      <div className="text-xs text-dark-muted">{page.followers} followers</div>
                    </div>
                    {selectedPages.includes(page.id) && (
                      <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button className="w-full gap-2">
              <CalendarDays className="h-4 w-4" /> Schedule Post
            </Button>
            <Button variant="outline" className="w-full">Save as Draft</Button>
            <Button variant="outline" className="w-full">Add to Queue</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
