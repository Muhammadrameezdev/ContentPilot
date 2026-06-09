"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Library,
  CalendarDays,
  ListOrdered,
  Clock,
  Sparkles,
  BarChart3,
  Globe,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { useSidebarStore } from "@/store/use-sidebar";
import { Logo } from "@/components/shared/logo";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { section: "Overview", items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    section: "Content",
    items: [
      { name: "Library", href: "/library", icon: Library },
      { name: "Calendar", href: "/calendar", icon: CalendarDays },
      { name: "Queue", href: "/queue", icon: ListOrdered },
      { name: "Scheduler", href: "/scheduler", icon: Clock },
    ],
  },
  { section: "AI Tools", items: [{ name: "Content Assistant", href: "/ai", icon: Sparkles }] },
  { section: "Insights", items: [{ name: "Analytics", href: "/analytics", icon: BarChart3 }] },
  {
    section: "Management",
    items: [
      { name: "Pages", href: "/pages", icon: Globe },
      { name: "Team", href: "/team", icon: Users },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Notifications", href: "/notifications", icon: Bell },
      { name: "Settings", href: "/settings/account", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-light-border dark:border-dark-border bg-white dark:bg-dark-surface"
    >
      <div className="flex items-center justify-between p-4 h-16">
        <Logo iconOnly={collapsed} size="sm" />
        {!collapsed && (
          <button
            onClick={toggle}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggle}
          className="mx-auto mb-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-4">
        {navItems.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-dark-muted">
                {group.section}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Tooltip key={item.href} content={`Open ${item.name}`} side="right">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-input text-sm transition-all",
                        collapsed && "justify-center px-2",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-light-border dark:border-dark-border">
        {!collapsed ? (
          <Tooltip content="Current plan limits and upgrade status" side="right">
            <div className="flex cursor-help items-center gap-3 px-2 py-2 rounded-input bg-primary/5 border border-primary/10">
              <Crown className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">Starter Plan</div>
                <div className="text-[10px] text-dark-muted">3 pages, 100 posts/mo</div>
              </div>
            </div>
          </Tooltip>
        ) : (
          <Tooltip content="Starter Plan: 3 pages, 100 posts/mo" side="right">
            <div className="flex justify-center">
              <Crown className="h-4 w-4 text-primary" />
            </div>
          </Tooltip>
        )}
      </div>
    </motion.aside>
  );
}
