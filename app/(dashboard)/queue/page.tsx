"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pause, Play, Trash2, RefreshCw, MoreVertical, Clock,
  CheckCircle, XCircle, Loader2, ListOrdered, Columns,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  DRAFT: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Draft" },
  QUEUED: { icon: ListOrdered, color: "text-blue-500", bg: "bg-blue-500/10", label: "Queued" },
  PUBLISHING: { icon: Loader2, color: "text-purple-500", bg: "bg-purple-500/10", label: "Publishing" },
  PUBLISHED: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Published" },
  FAILED: { icon: XCircle, color: "text-error", bg: "bg-error/10", label: "Failed" },
};

const demoQueue = [
  { id: "1", text: "5 AI tools for marketers...", page: "Tech Insights", scheduledAt: "Today 3:00 PM", status: "QUEUED" as const, priority: 1 },
  { id: "2", text: "Growth hacking secrets...", page: "Marketing Pro", scheduledAt: "Today 6:00 PM", status: "QUEUED" as const, priority: 2 },
  { id: "3", text: "Behind the scenes...", page: "Brand Hub", scheduledAt: "Tomorrow 9:00 AM", status: "DRAFT" as const, priority: 3 },
  { id: "4", text: "Tutorial: Setting up...", page: "Tech Insights", scheduledAt: "Tomorrow 12:00 PM", status: "QUEUED" as const, priority: 4 },
  { id: "5", text: "Product launch teaser", page: "Creative Studio", scheduledAt: "Jun 5, 3:00 PM", status: "PUBLISHING" as const, priority: 5 },
  { id: "6", text: "Weekly recap post", page: "Marketing Pro", scheduledAt: "Jun 4, 10:00 AM", status: "PUBLISHED" as const, priority: 0 },
  { id: "7", text: "Contest announcement", page: "Brand Hub", scheduledAt: "Jun 3, 2:00 PM", status: "FAILED" as const, priority: 0 },
];

export default function QueuePage() {
  const [view, setView] = useState<"kanban" | "list">("list");
  const [paused, setPaused] = useState(false);

  const groupedByStatus = Object.keys(statusConfig).reduce((acc, status) => {
    acc[status] = demoQueue.filter((q) => q.status === status);
    return acc;
  }, {} as Record<string, typeof demoQueue>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Queue</h2>
          <p className="text-sm text-dark-muted">{demoQueue.filter((q) => q.status === "QUEUED").length} posts in queue</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={paused ? "default" : "outline"} size="sm" onClick={() => setPaused(!paused)} className="gap-2">
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {paused ? "Resume Queue" : "Pause Queue"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-error">
            <Trash2 className="h-4 w-4" /> Clear Failed
          </Button>
        </div>
      </div>

      {/* Queue Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", paused ? "bg-warning animate-pulse" : "bg-success")} />
                <span className="text-sm font-medium">{paused ? "Queue Paused" : "Queue Active"}</span>
              </div>
              <div className="text-sm text-dark-muted">Rate: 4 posts/hour</div>
              <div className="text-sm text-dark-muted">
                Next publish: {demoQueue.find((q) => q.status === "QUEUED")?.scheduledAt ?? "None"}
              </div>
            </div>
            <div className="flex border border-light-border dark:border-dark-border rounded-input overflow-hidden">
              <button onClick={() => setView("list")} className={cn("px-3 py-1.5 text-xs font-medium", view === "list" ? "bg-primary text-white" : "")}>
                <ListOrdered className="h-3 w-3" />
              </button>
              <button onClick={() => setView("kanban")} className={cn("px-3 py-1.5 text-xs font-medium", view === "kanban" ? "bg-primary text-white" : "")}>
                <Columns className="h-3 w-3" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "kanban" ? (
        <div className="grid grid-cols-5 gap-4 overflow-x-auto">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <config.icon className={cn("h-4 w-4", config.color, status === "PUBLISHING" && "animate-spin")} />
                <span className="text-sm font-medium">{config.label}</span>
                <Badge variant="secondary" className="text-[10px]">{groupedByStatus[status]?.length ?? 0}</Badge>
              </div>
              <div className="space-y-2">
                {(groupedByStatus[status] ?? []).map((item) => (
                  <Card key={item.id} className="hover-lift">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2 mb-2">{item.text}</p>
                      <div className="text-xs text-dark-muted">{item.page}</div>
                      <div className="text-xs text-dark-muted mt-1">{item.scheduledAt}</div>
                      {status === "FAILED" && (
                        <Button size="sm" variant="outline" className="mt-2 w-full gap-1 text-xs">
                          <RefreshCw className="h-3 w-3" /> Retry
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-light-border dark:divide-dark-border">
            {demoQueue.map((item) => {
              const config = statusConfig[item.status];
              return (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className={cn("p-2 rounded-lg", config.bg)}>
                    <config.icon className={cn("h-4 w-4", config.color, item.status === "PUBLISHING" && "animate-spin")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.text}</p>
                    <p className="text-xs text-dark-muted">{item.page} &middot; {item.scheduledAt}</p>
                  </div>
                  <Badge variant={item.status === "PUBLISHED" ? "success" : item.status === "FAILED" ? "destructive" : "secondary"}>
                    {config.label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {item.status === "FAILED" && (
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Retry">
                        <RefreshCw className="h-3.5 w-3.5 text-dark-muted" />
                      </button>
                    )}
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                      <MoreVertical className="h-3.5 w-3.5 text-dark-muted" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
