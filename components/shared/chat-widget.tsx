"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
};

type ChatWidgetProps = {
  aiEndpoint?: string;
};

const replies = [
  "Great question! Our Pro plan includes unlimited scheduling and advanced analytics.",
  "You can connect up to 50 Facebook Pages on the Agency plan. 🚀",
  "Check out our API docs at /api - we have REST endpoints for all core features.",
  "Our team typically responds in under 2 hours. Want me to open a support ticket?",
  "ContentPilot supports bulk scheduling, AI captions, and real-time analytics.",
  "You can upgrade or downgrade your plan anytime from your account settings.",
];

const quickReplies = ["Pricing Plans", "How to Connect Pages", "API Access", "Talk to Human"];

async function sendToAI(message: string): Promise<string> {
  // TODO: Replace with Anthropic API call or OpenAI integration
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (message === "Talk to Human") {
    return "Connecting you to a human agent...\n(This would open a live chat in production)";
  }

  return replies[Math.floor(Math.random() * replies.length)];
}

export function ChatWidget({ aiEndpoint }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "bot",
          content: "Hi! 👋 I'm your ContentPilot assistant. How can I help you today?",
        },
      ]);
    }
  }, [messages.length, open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (messageText = input.trim()) => {
    if (!messageText || isTyping) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", content: messageText },
    ]);
    setIsTyping(true);

    const response = await sendToAI(messageText);
    void aiEndpoint;

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-bot`, role: "bot", content: response },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="mb-4 flex h-[480px] w-[calc(100vw-40px)] max-w-[320px] flex-col overflow-hidden rounded-card border border-light-border bg-white shadow-2xl dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="flex items-center justify-between border-b border-light-border px-4 py-3 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-success dark:border-dark-surface" />
                </div>
                <div>
                  <div className="text-sm font-semibold">ContentPilot Support</div>
                  <div className="text-xs text-success">Online</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-input p-1.5 text-dark-muted transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                aria-label="Close support chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div
                    className={cn(
                      "max-w-[86%] whitespace-pre-line rounded-card px-3 py-2 text-sm",
                      message.role === "user"
                        ? "ml-auto bg-primary text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-gray-100"
                    )}
                  >
                    {message.content}
                  </div>
                  {index === 0 && message.role === "bot" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          type="button"
                          onClick={() => handleSend(reply)}
                          className="rounded-full border border-light-border px-3 py-1 text-xs text-dark-muted transition-colors hover:border-primary hover:text-primary dark:border-dark-border"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex w-fit items-center gap-1 rounded-card bg-gray-100 px-3 py-2 dark:bg-white/5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-dark-muted"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <form
              className="flex gap-2 border-t border-light-border p-3 dark:border-dark-border"
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message..."
                className="min-w-0 flex-1 rounded-input border border-light-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-dark-border dark:bg-dark-bg"
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        aria-label="Open support chat"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
        <MessageCircle className="relative h-6 w-6" />
      </button>
    </div>
  );
}
