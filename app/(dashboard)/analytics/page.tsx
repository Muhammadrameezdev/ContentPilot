"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Eye, Heart, MessageCircle, Share2, MousePointer,
  BarChart3, RefreshCw,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Total Reach", value: "124.5K", change: "+12.3%", icon: Eye, color: "text-primary", bg: "bg-primary/10" },
  { label: "Impressions", value: "312.8K", change: "+8.7%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  { label: "Engagement Rate", value: "4.8%", change: "+0.5%", icon: BarChart3, color: "text-success", bg: "bg-success/10" },
  { label: "Total Likes", value: "8,432", change: "+15.2%", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  { label: "Comments", value: "1,245", change: "+22.1%", icon: MessageCircle, color: "text-warning", bg: "bg-warning/10" },
  { label: "Shares", value: "892", change: "+18.4%", icon: Share2, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Link Clicks", value: "3,156", change: "+9.8%", icon: MousePointer, color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const reachData = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  reach: Math.floor(Math.random() * 5000) + 2000,
  impressions: Math.floor(Math.random() * 8000) + 4000,
}));

const engagementData = Array.from({ length: 14 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  likes: Math.floor(Math.random() * 300) + 100,
  comments: Math.floor(Math.random() * 80) + 20,
  shares: Math.floor(Math.random() * 50) + 10,
}));

const postTypeData = [
  { name: "Image", value: 45, color: "#6366F1" },
  { name: "Video", value: 25, color: "#06B6D4" },
  { name: "Reel", value: 18, color: "#10B981" },
  { name: "Link", value: 12, color: "#F59E0B" },
];

const topPosts = [
  { text: "5 AI tools every marketer needs...", page: "Tech Insights", date: "Jun 1", reach: "12.5K", engagement: "8.2%", clicks: 345 },
  { text: "Growth hacking case study...", page: "Marketing Pro", date: "Jun 3", reach: "9.8K", engagement: "6.7%", clicks: 267 },
  { text: "Monday motivation post...", page: "Brand Hub", date: "Jun 5", reach: "8.1K", engagement: "5.9%", clicks: 198 },
  { text: "Product launch announcement...", page: "Creative Studio", date: "Jun 7", reach: "7.3K", engagement: "5.1%", clicks: 156 },
  { text: "Behind the scenes video...", page: "Tech Insights", date: "Jun 10", reach: "6.5K", engagement: "7.4%", clicks: 289 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-sm text-dark-muted">Track your content performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-light-border dark:border-dark-border rounded-input overflow-hidden">
            {[{ key: "7", label: "7D" }, { key: "30", label: "30D" }, { key: "90", label: "90D" }].map((d) => (
              <button
                key={d.key}
                onClick={() => setDateRange(d.key)}
                className={cn("px-3 py-1.5 text-xs font-medium", dateRange === d.key ? "bg-primary text-white" : "")}
              >
                {d.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-3 w-3" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="hover-lift">
            <CardContent className="p-3">
              <div className={cn("p-1.5 rounded-lg w-fit", metric.bg)}>
                <metric.icon className={cn("h-3.5 w-3.5", metric.color)} />
              </div>
              <p className="text-lg font-bold mt-2">{metric.value}</p>
              <p className="text-[10px] text-dark-muted">{metric.label}</p>
              <p className="text-[10px] text-success font-medium">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reach & Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reachData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#6B7280" interval={4} />
                  <YAxis tick={{ fontSize: 9 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="reach" stroke="#6366F1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="impressions" stroke="#06B6D4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend />
                  <Bar dataKey="likes" stackId="a" fill="#EC4899" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="comments" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="shares" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Post Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Post Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {postTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border">
                    <th className="text-left py-2 text-xs font-medium text-dark-muted">Post</th>
                    <th className="text-left py-2 text-xs font-medium text-dark-muted">Page</th>
                    <th className="text-right py-2 text-xs font-medium text-dark-muted">Reach</th>
                    <th className="text-right py-2 text-xs font-medium text-dark-muted">Engagement</th>
                    <th className="text-right py-2 text-xs font-medium text-dark-muted">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post, i) => (
                    <tr key={i} className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="py-3 max-w-[200px] truncate">{post.text}</td>
                      <td className="py-3 text-dark-muted">{post.page}</td>
                      <td className="py-3 text-right font-medium">{post.reach}</td>
                      <td className="py-3 text-right text-success">{post.engagement}</td>
                      <td className="py-3 text-right">{post.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
