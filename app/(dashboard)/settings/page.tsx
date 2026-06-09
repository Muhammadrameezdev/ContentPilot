import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SettingsIndexPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-dark-muted">
            Manage your account, notifications, billing, connections, and security settings.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Account", href: "/dashboard/settings/account" },
              { title: "Team", href: "/dashboard/settings/team" },
              { title: "Notifications", href: "/dashboard/settings/notifications" },
              { title: "Connections", href: "/dashboard/settings/connections" },
              { title: "Billing", href: "/dashboard/settings/billing" },
              { title: "Security", href: "/dashboard/settings/security" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-card border border-light-border dark:border-dark-border p-4 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-dark-muted mt-2">Open {item.title} settings.</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
