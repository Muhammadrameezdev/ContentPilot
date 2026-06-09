"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Grid3X3, List, FileText, Image, Video, Link2,
  MoreVertical, Copy, CalendarDays, Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

const contentTypes = {
  TEXT: { icon: FileText, label: "Text", color: "text-blue-500" },
  IMAGE: { icon: Image, label: "Image", color: "text-green-500" },
  VIDEO: { icon: Video, label: "Video", color: "text-purple-500" },
  LINK: { icon: Link2, label: "Link", color: "text-orange-500" },
};

const demoContent = [
  { id: "1", type: "TEXT" as const, text: "5 AI tools every marketer needs in 2024. Thread below...", status: "DRAFT", tags: ["ai", "marketing"], createdAt: "2024-06-01" },
  { id: "2", type: "IMAGE" as const, text: "New product launch announcement! Check out our latest...", status: "TEMPLATE", tags: ["product", "launch"], createdAt: "2024-05-28" },
  { id: "3", type: "VIDEO" as const, text: "Behind the scenes of our latest campaign shoot", status: "DRAFT", tags: ["bts", "campaign"], createdAt: "2024-05-25" },
  { id: "4", type: "TEXT" as const, text: "Monday motivation: The secret to consistency is...", status: "ARCHIVED", tags: ["motivation"], createdAt: "2024-05-20" },
  { id: "5", type: "LINK" as const, text: "Read our latest blog post on content strategy", status: "DRAFT", tags: ["blog", "strategy"], createdAt: "2024-05-18" },
  { id: "6", type: "IMAGE" as const, text: "Infographic: Social media statistics 2024", status: "TEMPLATE", tags: ["infographic", "stats"], createdAt: "2024-05-15" },
];

export default function LibraryPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = demoContent.filter((c) => {
    if (search && !c.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && c.type !== typeFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Library</h2>
          <p className="text-sm text-dark-muted">{demoContent.length} items</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Content
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted" />
          <Input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-1">
          {Object.entries(contentTypes).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                typeFilter === key ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
              )}
            >
              <val.icon className="h-3 w-3" />
              {val.label}
            </button>
          ))}
        </div>
        <div className="flex border border-light-border dark:border-dark-border rounded-input overflow-hidden">
          <button onClick={() => setView("grid")} className={cn("p-2", view === "grid" ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-white/5")}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={cn("p-2", view === "list" ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-white/5")}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No content found"
          description="Create your first piece of content to get started."
          action={{ label: "Create Content", onClick: () => {} }}
        />
      ) : (
        <div className={cn(view === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3")}>
          {filtered.map((content) => {
            const typeInfo = contentTypes[content.type];
            return (
              <motion.div key={content.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="hover-lift group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-lg bg-gray-100 dark:bg-white/5", typeInfo.color)}>
                          <typeInfo.icon className="h-4 w-4" />
                        </div>
                        <Badge variant={content.status === "DRAFT" ? "secondary" : content.status === "TEMPLATE" ? "default" : "outline"}>
                          {content.status}
                        </Badge>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                        <MoreVertical className="h-4 w-4 text-dark-muted" />
                      </button>
                    </div>
                    <p className="text-sm line-clamp-3 mb-3">{content.text}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {content.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-dark-muted">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-light-border dark:border-dark-border">
                      <span className="text-xs text-dark-muted">{content.createdAt}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Edit">
                          <Edit className="h-3 w-3 text-dark-muted" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Duplicate">
                          <Copy className="h-3 w-3 text-dark-muted" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5" title="Schedule">
                          <CalendarDays className="h-3 w-3 text-dark-muted" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
