import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Help & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dark-muted">
            Need help? This help center is coming soon. For now, visit the support docs or contact your account team.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
