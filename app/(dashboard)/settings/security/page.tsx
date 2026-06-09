"use client";

import { motion } from "framer-motion";
import { Shield, Smartphone, Monitor, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sessions = [
  { id: "1", device: "Chrome on Windows", ip: "192.168.1.1", lastActive: "Active now", current: true },
  { id: "2", device: "Safari on iPhone", ip: "10.0.0.1", lastActive: "2 hours ago", current: false },
  { id: "3", device: "Firefox on Mac", ip: "172.16.0.1", lastActive: "1 day ago", current: false },
];

const loginActivity = [
  { action: "Successful login", device: "Chrome on Windows", ip: "192.168.1.1", time: "Today 9:00 AM" },
  { action: "Successful login", device: "Safari on iPhone", ip: "10.0.0.1", time: "Yesterday 6:30 PM" },
  { action: "Failed login attempt", device: "Unknown", ip: "45.33.32.156", time: "Jun 1, 2024" },
  { action: "Password changed", device: "Chrome on Windows", ip: "192.168.1.1", time: "May 28, 2024" },
];

export default function SecurityPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-light-border dark:border-dark-border">
            <div>
              <p className="text-sm font-medium">Authenticator App</p>
              <p className="text-xs text-dark-muted">Use an authenticator app for 2FA codes</p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Smartphone className="h-3 w-3" /> Enable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg border border-light-border dark:border-dark-border">
                <Monitor className="h-5 w-5 text-dark-muted" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{session.device}</span>
                    {session.current && <Badge variant="success" className="text-[10px]">Current</Badge>}
                  </div>
                  <p className="text-xs text-dark-muted">IP: {session.ip} &middot; {session.lastActive}</p>
                </div>
                {!session.current && (
                  <Button size="sm" variant="outline" className="gap-1 text-error text-xs">
                    <LogOut className="h-3 w-3" /> Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Login Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.action.includes("Failed") ? "bg-error" : "bg-success"}`} />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-dark-muted">
                    {activity.device} &middot; {activity.ip} &middot; {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
