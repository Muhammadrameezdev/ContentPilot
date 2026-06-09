"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Plus,
} from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  format, isSameMonth, isSameDay, isToday, addMonths, subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CalendarView = "month" | "week" | "day";

const demoEvents = [
  { id: "1", date: new Date(), page: "Tech Insights", text: "AI tools roundup", status: "scheduled", color: "bg-primary" },
  { id: "2", date: new Date(), page: "Marketing Pro", text: "Growth hacks", status: "published", color: "bg-success" },
  { id: "3", date: new Date(Date.now() + 86400000), page: "Brand Hub", text: "Monday motivation", status: "draft", color: "bg-warning" },
  { id: "4", date: new Date(Date.now() + 86400000 * 2), page: "Tech Insights", text: "Tutorial post", status: "scheduled", color: "bg-primary" },
  { id: "5", date: new Date(Date.now() + 86400000 * 3), page: "Creative Studio", text: "Design tips", status: "scheduled", color: "bg-accent" },
  { id: "6", date: new Date(Date.now() - 86400000), page: "Marketing Pro", text: "Case study", status: "published", color: "bg-success" },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigate = (dir: "prev" | "next") => {
    setCurrentDate(dir === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const getEventsForDay = (day: Date) =>
    demoEvents.filter((e) => isSameDay(e.date, day));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Calendar</h2>
          <p className="text-sm text-dark-muted">Plan and visualize your content schedule</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Post
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button onClick={() => navigate("prev")} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="text-lg font-semibold min-w-[200px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </h3>
              <button onClick={() => navigate("next")} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>

          <div className="flex border border-light-border dark:border-dark-border rounded-input overflow-hidden">
            {(["month", "week", "day"] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  view === v ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-dark-muted">
          {[
            { label: "Published", color: "bg-success" },
            { label: "Scheduled", color: "bg-primary" },
            { label: "Draft", color: "bg-warning" },
            { label: "Failed", color: "bg-error" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", s.color)} />
              {s.label}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-light-border dark:bg-dark-border rounded-card overflow-hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-gray-50 dark:bg-dark-surface p-2 text-center text-xs font-medium text-dark-muted">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const events = getEventsForDay(day);
            const inMonth = isSameMonth(day, currentDate);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "bg-white dark:bg-dark-surface min-h-[100px] p-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer",
                  !inMonth && "opacity-40"
                )}
              >
                <div className={cn(
                  "text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                  isToday(day) && "bg-primary text-white"
                )}>
                  {format(day, "d")}
                </div>
                <div className="space-y-0.5">
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn("text-[10px] px-1.5 py-0.5 rounded truncate text-white", event.color)}
                      title={`${event.page}: ${event.text}`}
                    >
                      {event.text}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-[10px] text-dark-muted px-1">+{events.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
