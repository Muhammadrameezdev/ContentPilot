"use client";

import { motion } from "framer-motion";
import { Globe, RefreshCw, Trash2, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const connections = [
  { id: "1", name: "Tech Insights", status: "active", tokenExpiry: "Aug 15, 2024", connectedAt: "Jan 15, 2024" },
  { id: "2", name: "Marketing Pro", status: "active", tokenExpiry: "Sep 1, 2024", connectedAt: "Feb 1, 2024" },
  { id: "3", name: "Brand Hub", status: "expired", tokenExpiry: "May 30, 2024", connectedAt: "Jan 20, 2024" },
  { id: "4", name: "Creative Studio", status: "active", tokenExpiry: "Oct 10, 2024", connectedAt: "Mar 10, 2024" },
];

export default function ConnectionsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Facebook Connections</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Connect Account
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {connections.map((conn) => (
              <div key={conn.id} className="flex items-center gap-4 p-4 rounded-lg border border-light-border dark:border-dark-border">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{conn.name}</span>
                    {conn.status === "active" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-dark-muted">
                    <span>Connected: {conn.connectedAt}</span>
                    <span className={cn(conn.status === "expired" && "text-error")}>
                      Token: {conn.status === "expired" ? "Expired" : `Expires ${conn.tokenExpiry}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <RefreshCw className="h-3 w-3" /> Reconnect
                  </Button>
                  <Button size="sm" variant="outline" className="text-error">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
