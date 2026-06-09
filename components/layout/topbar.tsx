"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Bell,
  Command,
  LogOut,
  Settings,
  HelpCircle,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  BellOff,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Tooltip } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useSidebarStore } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/library": "Content Library",
  "/calendar": "Content Calendar",
  "/queue": "Content Queue",
  "/scheduler": "Post Scheduler",
  "/ai": "AI Content Assistant",
  "/analytics": "Analytics",
  "/pages": "Facebook Pages",
  "/team": "Team Management",
  "/notifications": "Notifications",
  "/settings/account": "Account Settings",
  "/settings/team": "Team Settings",
  "/settings/notifications": "Notification Settings",
  "/settings/connections": "Connected Accounts",
  "/settings/billing": "Billing & Subscription",
  "/settings/security": "Security",
};

// Icon + color config — matches notification page styling exactly
const notificationTypeMap: Record<
  string,
  { icon: React.ElementType; iconBg: string; iconColor: string }
> = {
  POST_PUBLISHED: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  POST_FAILED: {
    icon: XCircle,
    iconBg: "bg-error/10",
    iconColor: "text-error",
  },
  TOKEN_EXPIRING: {
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  TOKEN_EXPIRED: {
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  TEAM_ACTIVITY: {
    icon: User,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  QUEUE_ERROR: {
    icon: AlertCircle,
    iconBg: "bg-error/10",
    iconColor: "text-error",
  },
  QUEUE_ALERT: {
    icon: AlertCircle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  WEEKLY_REPORT: {
    icon: CheckCircle,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
};

// Fallback config for unknown types
const defaultNotificationType = {
  icon: Bell,
  iconBg: "bg-primary/10",
  iconColor: "text-primary",
};

// Relative time helper
function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
};

type SearchResponse = {
  posts: SearchResult[];
  pages: SearchResult[];
  queue: SearchResult[];
  members: SearchResult[];
};

const initialSearchResults: SearchResponse = {
  posts: [],
  pages: [],
  queue: [],
  members: [],
};


// Dummy notifications — shown when DB has no real notifications yet
const DUMMY_NOTIFICATIONS = [
  {
    id: "demo-1",
    type: "POST_PUBLISHED",
    title: "Post Published",
    message: '"Summer Campaign 2026" is live on Life Style Page',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "demo-2",
    type: "POST_FAILED",
    title: "Post Failed",
    message: '"Weekly Newsletter" failed — access token expired',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "demo-3",
    type: "TEAM_ACTIVITY",
    title: "Team Activity",
    message: "Sarah Connor added 5 posts to the content library",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
  },
  {
    id: "demo-4",
    type: "QUEUE_ALERT",
    title: "Queue Alert",
    message: "Publishing queue has been paused due to rate limit",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
  },
];

export function TopBar() {
  const pathname = usePathname();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const title = pageTitles[pathname] ?? "Dashboard";
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse>(initialSearchResults);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = session?.user;

  // Close modals on outside click / Escape
  useEffect(() => {
    const handler = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
      if (event instanceof MouseEvent) {
        const target = event.target as Node;
        if (searchRef.current && !searchRef.current.contains(target)) setSearchOpen(false);
        if (notificationsRef.current && !notificationsRef.current.contains(target)) setNotificationsOpen(false);
        if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(initialSearchResults);
      return;
    }
    setSearchLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) { setSearchResults(initialSearchResults); return; }
        const results = (await response.json()) as SearchResponse;
        setSearchResults(results);
      } catch {
        setSearchResults(initialSearchResults);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Fetch notifications when panel opens — fall back to dummy data if DB is empty
  useEffect(() => {
    if (!notificationsOpen) return;
    const loadNotifications = async () => {
      try {
        const response = await fetch("/api/notifications?limit=5");
        if (!response.ok) {
          setNotifications(DUMMY_NOTIFICATIONS);
          setUnreadCount(DUMMY_NOTIFICATIONS.filter((n) => !n.isRead).length);
          return;
        }
        const payload = await response.json();
        const real: any[] = payload.notifications ?? [];
        if (real.length === 0) {
          setNotifications(DUMMY_NOTIFICATIONS);
          setUnreadCount(DUMMY_NOTIFICATIONS.filter((n) => !n.isRead).length);
        } else {
          setNotifications(real);
          setUnreadCount(payload.unreadCount ?? 0);
        }
      } catch (error) {
        console.error(error);
        setNotifications(DUMMY_NOTIFICATIONS);
        setUnreadCount(DUMMY_NOTIFICATIONS.filter((n) => !n.isRead).length);
      }
    };
    loadNotifications();
  }, [notificationsOpen]);

  const markAllRead = async () => {
    try {
      const response = await fetch("/api/notifications/all/read", { method: "PATCH" });
      if (!response.ok) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  const closeAll = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  const totalResults =
    searchResults.posts.length +
    searchResults.pages.length +
    searchResults.queue.length +
    searchResults.members.length;

  const resultSections = [
    { label: "Posts", items: searchResults.posts, color: "bg-primary/10 text-primary" },
    { label: "Pages", items: searchResults.pages, color: "bg-accent/10 text-accent" },
    { label: "Queue", items: searchResults.queue, color: "bg-success/10 text-success" },
    { label: "Members", items: searchResults.members, color: "bg-warning/10 text-warning" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-light-border dark:border-dark-border",
        "bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl",
        "flex items-center justify-between px-6",
        "transition-all duration-200",
        collapsed ? "left-16" : "left-60"
      )}
    >
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 h-10 rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-3">
            <Search className="h-4 w-4 text-dark-muted" />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search dashboard..."
              className="min-w-[220px] bg-transparent text-sm text-dark-foreground placeholder:text-dark-muted outline-none"
            />
            {searchLoading && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
            <kbd className="hidden md:inline-flex items-center gap-0.5 rounded bg-white dark:bg-dark-border px-2 py-1 text-[10px] text-dark-muted">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
          {searchOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[28rem] max-w-full overflow-hidden rounded-card border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-xl">
              <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Search results</p>
                    <p className="text-xs text-dark-muted">{totalResults} result{totalResults === 1 ? "" : "s"}</p>
                  </div>
                  <button onClick={() => setSearchOpen(false)} className="text-sm text-dark-muted hover:text-dark-foreground">
                    Close
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-3">
                {searchQuery.trim() === "" ? (
                  <div className="text-sm text-dark-muted">Search posts, pages, queue items, and team members.</div>
                ) : searchLoading ? (
                  <div className="text-sm text-dark-muted">Loading results...</div>
                ) : totalResults === 0 ? (
                  <div className="text-sm text-dark-muted">No results found.</div>
                ) : (
                  resultSections.map((section) =>
                    section.items.length > 0 ? (
                      <div key={section.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-dark-muted">{section.label}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", section.color)}>{section.items.length}</span>
                        </div>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={closeAll}
                              className="flex items-start justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-dark-foreground truncate">{item.title}</p>
                                <p className="text-xs text-dark-muted truncate">{item.subtitle}</p>
                              </div>
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-dark-muted">{item.badge}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setNotificationsOpen((cur) => !cur);
              setSearchOpen(false);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-input hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-error border-2 border-white dark:border-dark-bg" />
            )}
          </button>

          {/* Notification Dropdown — matches reference design */}
          {notificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[320px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-light-border dark:border-white/10 bg-white dark:bg-[#16161f] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-light-border dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-dark-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white leading-tight">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Mark all read
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[340px] overflow-y-auto">
                {notifications.length === 0 ? (
                  // Empty state
                  <div className="flex flex-col items-center justify-center py-10 gap-3 px-4 text-center">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                      <BellOff className="h-6 w-6 text-dark-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-foreground">No notifications yet</p>
                      <p className="text-xs text-dark-muted mt-1">
                        We'll notify you when something important happens.
                      </p>
                    </div>
                  </div>
                ) : (
                  // Notification list
                  <div className="divide-y divide-light-border dark:divide-white/5">
                    {notifications.map((notification) => {
                      const typeKey = notification.type?.toUpperCase() ?? "";
                      const config = notificationTypeMap[typeKey] ?? defaultNotificationType;
                      const Icon = config.icon;
                      const isDummy = notification.id.startsWith("demo-");
                      return (
                        <button
                          key={notification.id}
                          onClick={() => {
                            if (!notification.isRead) {
                              // Optimistic update
                              setNotifications((prev) =>
                                prev.map((n) =>
                                  n.id === notification.id ? { ...n, isRead: true } : n
                                )
                              );
                              setUnreadCount((c) => Math.max(0, c - 1));
                              // Only call API for real notifications
                              if (!isDummy) {
                                fetch(`/api/notifications/${notification.id}/read`, {
                                  method: "PATCH",
                                }).catch(console.error);
                              }
                            }
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                        >
                          {/* Icon box — matches notification page style */}
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              config.iconBg
                            )}
                          >
                            <Icon className={cn("h-4 w-4", config.iconColor)} />
                          </div>

                          {/* Text content */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-dark-foreground leading-snug">
                              {notification.title}
                            </p>
                            <p className="text-xs text-dark-muted mt-0.5 leading-relaxed line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-[11px] text-dark-muted/70 mt-1">
                              {relativeTime(notification.createdAt)}
                            </p>
                          </div>

                          {/* Unread dot */}
                          {!notification.isRead && (
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-light-border dark:border-white/10 px-4 py-3 text-center">
                <Link
                  href="/notifications"
                  onClick={closeAll}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <Tooltip content="Switch between light and dark mode" side="bottom">
          <span className="inline-flex">
            <ThemeToggle />
          </span>
        </Tooltip>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen((cur) => !cur);
              setSearchOpen(false);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-input border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface p-1.5"
          >
            <UserAvatar name={user?.name ?? user?.email ?? "User"} image={user?.image} size={32} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-card border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-xl">
              <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <UserAvatar name={user?.name ?? "User"} image={user?.image} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark-foreground truncate">{user?.name ?? "Your Name"}</p>
                    <p className="text-xs text-dark-muted truncate">{user?.email ?? "No email available"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1 border-t border-light-border dark:border-dark-border px-2 py-2">
                <Link
                  href="/profile"
                  onClick={closeAll}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-foreground hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={closeAll}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-foreground hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <Link
                  href="/help"
                  onClick={closeAll}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-foreground hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <HelpCircle className="h-4 w-4" /> Help & Support
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}