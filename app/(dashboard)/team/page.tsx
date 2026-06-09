"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Mail, Shield, Crown, Edit, Eye, MoreVertical,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";

const roleConfig = {
  OWNER: { icon: Crown, color: "text-warning", label: "Owner" },
  ADMIN: { icon: Shield, color: "text-primary", label: "Admin" },
  EDITOR: { icon: Edit, color: "text-success", label: "Editor" },
  VIEWER: { icon: Eye, color: "text-dark-muted", label: "Viewer" },
};

const members = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "OWNER" as const, status: "ACTIVE", joinedAt: "Jan 15, 2024" },
  { id: "2", name: "Sarah Kim", email: "sarah@example.com", role: "ADMIN" as const, status: "ACTIVE", joinedAt: "Feb 1, 2024" },
  { id: "3", name: "Marcus T.", email: "marcus@example.com", role: "EDITOR" as const, status: "ACTIVE", joinedAt: "Mar 10, 2024" },
  { id: "4", name: "Priya M.", email: "priya@example.com", role: "VIEWER" as const, status: "ACTIVE", joinedAt: "Apr 5, 2024" },
  { id: "5", name: "Alex Johnson", email: "alex@example.com", role: "EDITOR" as const, status: "PENDING", joinedAt: "Jun 1, 2024" },
];

const activities = [
  { action: "Post created", user: "Sarah Kim", time: "2 hours ago", type: "content" },
  { action: "Post published to Tech Insights", user: "Marcus T.", time: "3 hours ago", type: "publish" },
  { action: "Joined the workspace", user: "Alex Johnson", time: "1 day ago", type: "team" },
  { action: "Connected new Facebook page", user: "John Doe", time: "2 days ago", type: "page" },
  { action: "Post approved", user: "Sarah Kim", time: "3 days ago", type: "approval" },
];

const permissions = [
  { action: "Connect Pages", OWNER: true, ADMIN: true, EDITOR: false, VIEWER: false },
  { action: "Publish Posts", OWNER: true, ADMIN: true, EDITOR: true, VIEWER: false },
  { action: "Create Content", OWNER: true, ADMIN: true, EDITOR: true, VIEWER: false },
  { action: "View Analytics", OWNER: true, ADMIN: true, EDITOR: true, VIEWER: true },
  { action: "Invite Members", OWNER: true, ADMIN: true, EDITOR: false, VIEWER: false },
  { action: "Billing Access", OWNER: true, ADMIN: false, EDITOR: false, VIEWER: false },
  { action: "Delete Content", OWNER: true, ADMIN: true, EDITOR: false, VIEWER: false },
];

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-sm text-dark-muted">{members.length} members</p>
        </div>
        <Button onClick={() => setShowInvite(!showInvite)} className="gap-2">
          <Plus className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Invite New Member</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input placeholder="Email address" type="email" />
                </div>
                <select className="h-10 rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3 text-sm">
                  <option>Viewer</option>
                  <option>Editor</option>
                  <option>Admin</option>
                </select>
                <Button className="gap-2">
                  <Mail className="h-4 w-4" /> Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Member List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => {
                  const role = roleConfig[member.role];
                  return (
                    <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold">
                        {getInitials(member.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{member.name}</span>
                          {member.status === "PENDING" && <Badge variant="warning" className="text-[10px]">Pending</Badge>}
                        </div>
                        <p className="text-xs text-dark-muted">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <role.icon className={cn("h-3 w-3", role.color)} />
                          {role.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-dark-muted hidden sm:block">{member.joinedAt}</span>
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                        <MoreVertical className="h-4 w-4 text-dark-muted" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      <th className="text-left py-2 text-xs font-medium text-dark-muted">Permission</th>
                      {(["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const).map((r) => (
                        <th key={r} className="text-center py-2 text-xs font-medium text-dark-muted">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm) => (
                      <tr key={perm.action} className="border-b border-light-border dark:border-dark-border last:border-0">
                        <td className="py-2 text-sm">{perm.action}</td>
                        {(["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const).map((r) => (
                          <td key={r} className="text-center py-2">
                            {perm[r] ? (
                              <CheckCircle className="h-4 w-4 text-success inline" />
                            ) : (
                              <span className="text-dark-muted">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-dark-muted">{activity.action}</span>
                    </p>
                    <p className="text-xs text-dark-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
