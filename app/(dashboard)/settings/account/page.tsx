"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Camera, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar name={user?.name ?? user?.email ?? "User"} image={user?.image} size={80} className="rounded-full" />
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white hover:bg-primary-hover">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="font-medium">{user?.name ?? "Your Name"}</p>
              <p className="text-sm text-dark-muted">{user?.email ?? "No email available"}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <Input defaultValue={user?.name ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input defaultValue={user?.email ?? ""} type="email" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Username</label>
              <Input defaultValue={user?.email?.split("@")[0] ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Timezone</label>
              <select className="flex h-10 w-full rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm">
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Language</label>
            <select className="flex h-10 w-full rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card className="border-error/20">
        <CardHeader>
          <CardTitle className="text-base text-error">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dark-muted mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete Account
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
