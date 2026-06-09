"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, CreditCard, Activity, Search,
  Shield, MoreVertical, TrendingUp,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const adminStats = [
  { label: "Total Users", value: "1,248", change: "+45 this month", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "Active Subscriptions", value: "892", change: "+32 this month", icon: CreditCard, color: "text-success", bg: "bg-success/10" },
  { label: "Monthly Revenue", value: "$18,450", change: "+12% vs last month", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  { label: "Active Sessions", value: "156", change: "Currently online", icon: Activity, color: "text-warning", bg: "bg-warning/10" },
];

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  revenue: Math.floor(Math.random() * 10000) + 10000,
  users: Math.floor(Math.random() * 200) + 800,
}));

const users = [
  { id: "1", name: "Sarah Kim", email: "sarah@example.com", plan: "PRO", status: "Active", pages: 8, postsThisMonth: 156 },
  { id: "2", name: "Marcus T.", email: "marcus@example.com", plan: "STARTER", status: "Active", pages: 2, postsThisMonth: 45 },
  { id: "3", name: "Priya M.", email: "priya@example.com", plan: "AGENCY", status: "Active", pages: 23, postsThisMonth: 312 },
  { id: "4", name: "Alex J.", email: "alex@example.com", plan: "STARTER", status: "Suspended", pages: 1, postsThisMonth: 0 },
  { id: "5", name: "Jordan W.", email: "jordan@example.com", plan: "PRO", status: "Active", pages: 12, postsThisMonth: 89 },
];

const recentActivities = [
  { action: "New user registered", user: "Emma Wilson", time: "5 minutes ago" },
  { action: "Subscription upgraded to PRO", user: "David Chen", time: "1 hour ago" },
  { action: "Account suspended", user: "Spam Bot 42", time: "3 hours ago" },
  { action: "Support ticket opened", user: "Lisa Park", time: "5 hours ago" },
  { action: "Subscription cancelled", user: "Mike Brown", time: "8 hours ago" },
];

export default function AdminPage() {
  const [search, setSearch] = useState("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-dark-muted">{stat.label}</p>
                  <p className="text-[10px] text-success">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="users" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">User Management</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-8 text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left py-2 text-xs font-medium text-dark-muted">User</th>
                  <th className="text-left py-2 text-xs font-medium text-dark-muted">Plan</th>
                  <th className="text-center py-2 text-xs font-medium text-dark-muted">Status</th>
                  <th className="text-right py-2 text-xs font-medium text-dark-muted">Pages</th>
                  <th className="text-right py-2 text-xs font-medium text-dark-muted">Posts/mo</th>
                  <th className="text-right py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-dark-muted">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={user.plan === "AGENCY" ? "default" : user.plan === "PRO" ? "secondary" : "outline"}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={user.status === "Active" ? "success" : "destructive"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">{user.pages}</td>
                    <td className="py-3 text-right">{user.postsThisMonth}</td>
                    <td className="py-3 text-right">
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                        <MoreVertical className="h-4 w-4 text-dark-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="text-dark-muted">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.user}</span>
                  </p>
                  <p className="text-xs text-dark-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
