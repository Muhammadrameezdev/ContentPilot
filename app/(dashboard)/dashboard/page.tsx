"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import {
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Layers,
  TrendingUp,
  Plus,
  CalendarDays,
  Sparkles,
  Inbox,
  CalendarX,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Connected Pages", value: data?.connectedPages ?? "—", icon: Globe, color: "text-primary", bg: "bg-primary/10" },
    { label: "Scheduled Posts", value: data?.scheduledPosts ?? "—", icon: Clock, color: "text-accent", bg: "bg-accent/10" },
    { label: "Published Posts", value: data?.publishedPosts ?? "—", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "Failed Posts", value: data?.failedPosts ?? "—", icon: AlertCircle, color: "text-error", bg: "bg-error/10" },
    { label: "Queue Size", value: data?.queueSize ?? "—", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Monthly Reach", value: data?.monthlyReach ? data.monthlyReach.toLocaleString() : "—", icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
  ];

  const activities = data?.recentActivity || [];
  const upcomingPosts = data?.upcomingPosts || [];
  const publishingActivity = data?.publishingActivity || [];
  const engagementTrend = data?.engagementTrend || [];

  return (
    <motion.div initial="initial" animate="animate" variants={container} className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="hover-lift cursor-default">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                    <p className="text-xs text-dark-muted">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publishing Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-dark-muted">Loading chart...</div>
                ) : publishingActivity.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-dark-muted">No publishing activity yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={publishingActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#6B7280" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111118",
                          border: "1px solid #1E1E2E",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="posts" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Engagement Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-dark-muted">Loading chart...</div>
                ) : engagementTrend.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-dark-muted">No engagement data yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#6B7280" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111118",
                          border: "1px solid #1E1E2E",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line type="monotone" dataKey="reach" stroke="#6366F1" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="impressions" stroke="#06B6D4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      <div className="space-y-1 flex-1">
                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        <div className="h-2 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-white/5">
                    <Inbox className="h-6 w-6 text-dark-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-foreground">No activity yet</p>
                    <p className="text-xs text-dark-muted mt-0.5">Your recent publishing actions will appear here.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                          activity.type === "published"
                            ? "bg-success"
                            : activity.type === "failed"
                            ? "bg-error"
                            : activity.type === "scheduled"
                            ? "bg-accent"
                            : "bg-primary"
                        }`}
                      />
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-dark-muted">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Posts */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Upcoming Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                      <div className="space-y-1 flex-1">
                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-white/5">
                    <CalendarX className="h-6 w-6 text-dark-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-foreground">No scheduled posts</p>
                    <p className="text-xs text-dark-muted mt-0.5">
                      Posts you schedule will appear here.{" "}
                      <Link href="/scheduler" className="text-primary hover:underline">
                        Schedule one now →
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPosts.map((post: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{post.text}</p>
                        <p className="text-xs text-dark-muted">
                          {post.page} &middot; {new Date(post.time).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions — FIXED hrefs to match (dashboard) route group URL structure */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Create Post", icon: Plus, href: "/library", color: "bg-primary/10 text-primary" },
                  { label: "Schedule Post", icon: Clock, href: "/scheduler", color: "bg-accent/10 text-accent" },
                  { label: "Add Page", icon: Globe, href: "/pages", color: "bg-success/10 text-success" },
                  { label: "Generate with AI", icon: Sparkles, href: "/ai", color: "bg-warning/10 text-warning" },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-card border border-light-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-white/5 transition-all hover-lift cursor-pointer">
                      <div className={`p-3 rounded-xl ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}