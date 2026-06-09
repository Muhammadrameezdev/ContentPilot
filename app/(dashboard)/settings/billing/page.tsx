"use client";

import { motion } from "framer-motion";
import { CreditCard, Download, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const invoices = [
  { id: "INV-001", date: "Jun 1, 2024", amount: "$19.00", status: "Paid" },
  { id: "INV-002", date: "May 1, 2024", amount: "$19.00", status: "Paid" },
  { id: "INV-003", date: "Apr 1, 2024", amount: "$19.00", status: "Paid" },
  { id: "INV-004", date: "Mar 1, 2024", amount: "$19.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      {/* Current Plan */}
      <Card className="border-primary/30 bg-primary/[0.02]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-2">Current Plan</Badge>
              <h3 className="text-2xl font-bold">Starter</h3>
              <p className="text-dark-muted text-sm mt-1">$19/month &middot; Renews Jul 1, 2024</p>
            </div>
            <Button className="gap-2">
              <ArrowUpCircle className="h-4 w-4" /> Upgrade Plan
            </Button>
          </div>
          <div className="mt-6 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Pages</span>
                <span className="text-sm font-medium">2 / 3</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "67%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Posts this month</span>
                <span className="text-sm font-medium">67 / 100</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "67%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border border-light-border dark:border-dark-border">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visa ending in 4242</p>
              <p className="text-xs text-dark-muted">Expires 12/2025</p>
            </div>
            <Button size="sm" variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left py-2 text-xs font-medium text-dark-muted">Invoice</th>
                  <th className="text-left py-2 text-xs font-medium text-dark-muted">Date</th>
                  <th className="text-right py-2 text-xs font-medium text-dark-muted">Amount</th>
                  <th className="text-right py-2 text-xs font-medium text-dark-muted">Status</th>
                  <th className="text-right py-2"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-light-border dark:border-dark-border last:border-0">
                    <td className="py-3 font-mono text-xs">{inv.id}</td>
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3 text-right font-medium">{inv.amount}</td>
                    <td className="py-3 text-right">
                      <Badge variant="success" className="text-[10px]">{inv.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                        <Download className="h-3.5 w-3.5 text-dark-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cancel */}
      <Card className="border-error/20">
        <CardContent className="p-6">
          <p className="text-sm text-dark-muted mb-4">
            Canceling your subscription will downgrade your account at the end of the current billing period.
          </p>
          <Button variant="destructive" size="sm">Cancel Subscription</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
