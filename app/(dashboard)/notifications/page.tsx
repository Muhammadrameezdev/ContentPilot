"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, XCircle, AlertTriangle, Users, BarChart3,
  AlertCircle, Check, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

const notificationTypes = {
  POST_PUBLISHED: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  POST_FAILED: { icon: XCircle, color: "text-error", bg: "bg-error/10" },
  TOKEN_EXPIRED: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  TEAM_ACTIVITY: { icon: Users, color: "text-primary", bg: "bg-primary/10" },
  WEEKLY_REPORT: { icon: BarChart3, color: "text-accent", bg: "bg-accent/10" },
  QUEUE_ERROR: { icon: AlertCircle, color: "text-error", bg: "bg-error/10" },
};

const demoNotifications = [
  { id: "1", type: "POST_PUBLISHED" as const, title: "Post Published", message: "Your post 'AI Tools Roundup' was published to Tech Insights", isRead: false, createdAt: new Date().toISOString() },
  { id: "2", type: "POST_FAILED" as const, title: "Post Failed", message: "Failed to publish 'Growth Hacks' to Marketing Pro. Rate limit exceeded.", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", type: "TOKEN_EXPIRED" as const, title: "Token Expiring Soon", message: "The access token for Brand Hub expires in 5 days. Please reconnect.", isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "4", type: "TEAM_ACTIVITY" as const, title: "New Team Member", message: "Alex Johnson accepted your invitation and joined the workspace.", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "5", type: "WEEKLY_REPORT" as const, title: "Weekly Report Ready", message: "Your weekly content performance report is ready to view.", isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "6", type: "POST_PUBLISHED" as const, title: "Post Published", message: "Your scheduled post was published to Creative Studio", isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "7", type: "QUEUE_ERROR" as const, title: "Queue Error", message: "The publishing queue was paused due to consecutive failures.", isRead: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-sm text-dark-muted">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <Check className="h-4 w-4" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => {
          const config = notificationTypes[notification.type];
          return (
            <motion.div key={notification.id} layout>
              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  !notification.isRead && "border-primary/30 bg-primary/[0.02]"
                )}
                onClick={() => markRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                      <config.icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-dark-muted mt-0.5">{notification.message}</p>
                      <p className="text-xs text-dark-muted mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5 text-dark-muted" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
