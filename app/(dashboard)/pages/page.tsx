"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe, Plus, Search, Grid3X3, List, RefreshCw,
  BarChart3, ExternalLink, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export default function PagesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pages");
      const json = await res.json();
      if (json.error) {
        toast.error(json.error);
      } else {
        setPages(json.data || []);
      }
    } catch (error) {
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPage = () => {
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "STUB_CLIENT_ID";
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/pages/connect/callback` : "";
    const scope = "pages_manage_posts,pages_read_engagement,pages_show_list";
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const filtered = pages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Facebook Pages</h2>
          <p className="text-sm text-dark-muted">{pages.length} pages connected</p>
        </div>
        <Button className="gap-2" onClick={handleConnectPage}>
          <Plus className="h-4 w-4" /> Connect Facebook Page
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex border border-light-border dark:border-dark-border rounded-input overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn("p-2 transition-colors", view === "grid" ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-white/5")}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-2 transition-colors", view === "list" ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-white/5")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-12 w-12" />}
          title="No pages found"
          description="Connect your Facebook pages to start managing content."
          action={{ label: "Connect Page", onClick: handleConnectPage }}
        />
      ) : (
        <div className={cn(view === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3")}>
          {filtered.map((page) => {
            const isTokenExpired = new Date(page.tokenExpiresAt) < new Date();
            const statusBadge = isTokenExpired ? "warning" : (page.isActive ? "success" : "error");
            return (
              <motion.div key={page.id} layout>
                <Card className="hover-lift">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {page.profileImage ? (
                          <img src={page.profileImage} alt={page.name} className="w-full h-full object-cover" />
                        ) : (
                          <Globe className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{page.name}</h3>
                          {!isTokenExpired && page.isActive && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
                          {isTokenExpired && <AlertTriangle className="h-4 w-4 text-warning shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {page.category && <Badge variant="secondary" className="text-[10px]">{page.category}</Badge>}
                          <span className="text-xs text-dark-muted">{formatNumber(page.followers)} followers</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-dark-muted">
                      <span>Posts: {page._count?.posts || 0}</span>
                      <Badge variant={statusBadge}>
                        {isTokenExpired ? "Token Expired" : (page.isActive ? "Active" : "Inactive")}
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs">
                        <BarChart3 className="h-3 w-3" /> Analytics
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs">
                        <ExternalLink className="h-3 w-3" /> Manage
                      </Button>
                      {isTokenExpired && (
                        <Button size="sm" variant="outline" className="gap-1 text-xs text-warning" onClick={handleConnectPage}>
                          <RefreshCw className="h-3 w-3" /> Reconnect
                        </Button>
                      )}
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
