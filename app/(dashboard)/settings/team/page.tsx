"use client";

import { motion } from "framer-motion";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-dashed border-dark-border cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-6 w-6 text-dark-muted" />
            </div>
            <div>
              <p className="text-sm font-medium">Workspace Logo</p>
              <p className="text-xs text-dark-muted">PNG, JPG up to 2MB</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Workspace Name</label>
            <Input defaultValue="My Workspace" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Workspace URL</label>
            <div className="flex items-center">
              <span className="text-sm text-dark-muted mr-2">contentpilot.com/</span>
              <Input defaultValue="my-workspace" className="flex-1" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-light-border dark:border-dark-border">
            <div>
              <p className="text-sm font-medium">Approval Workflow</p>
              <p className="text-xs text-dark-muted">Require admin approval before publishing (Editor role)</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-dark-border transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
            </button>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
