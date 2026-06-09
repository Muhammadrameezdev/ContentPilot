"use client";

import { motion } from "framer-motion";
import { Save, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notificationSettings = [
  { label: "Post Published", description: "When a scheduled post is published successfully" },
  { label: "Post Failed", description: "When a post fails to publish" },
  { label: "Token Expired", description: "When a Facebook token needs renewal" },
  { label: "Team Activity", description: "When a member joins or takes an action" },
  { label: "Weekly Report", description: "Auto-generated weekly performance summary" },
  { label: "Queue Error", description: "When the publishing queue encounters an error" },
];

export default function NotificationSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 mb-4">
            <div className="grid grid-cols-[1fr_80px_80px] gap-2 text-xs font-medium text-dark-muted px-1">
              <span>Notification Type</span>
              <span className="text-center flex items-center justify-center gap-1"><Bell className="h-3 w-3" /> In-App</span>
              <span className="text-center flex items-center justify-center gap-1"><Mail className="h-3 w-3" /> Email</span>
            </div>
          </div>
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <div key={setting.label} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="text-xs text-dark-muted">{setting.description}</p>
                </div>
                <div className="flex justify-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary transition-colors">
                    <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-4 transition-transform" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300 dark:bg-dark-border transition-colors">
                    <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Digest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Real-time", "Daily Digest", "Weekly Digest"].map((option) => (
              <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-light-border dark:border-dark-border cursor-pointer hover:border-primary/50 transition-colors">
                <input type="radio" name="digest" className="text-primary" defaultChecked={option === "Real-time"} />
                <span className="text-sm font-medium">{option}</span>
              </label>
            ))}
          </div>
          <Button className="mt-4 gap-2">
            <Save className="h-4 w-4" /> Save Preferences
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
