"use client";

import { create } from "zustand";
import type { AiTextFeature } from "@/lib/ai/groq";

// Global AI status lives in the Zustand layer (not a React Context / lib hook) so
// dashboard sidebars, chat widgets, and the AI page stay in sync while a Groq
// stream is in flight or a Gemini image is being generated.
type AiStatus = "idle" | "streaming" | "generating-image" | "error";

interface AiAssistantState {
  status: AiStatus;
  /** Incrementally-built text from the Groq token stream. */
  text: string;
  /** Data URL of the last image generated via Google Gen AI. */
  imageUrl: string | null;
  error: string | null;

  reset: () => void;
  streamText: (feature: AiTextFeature, input: string) => Promise<void>;
  generateImage: (prompt: string) => Promise<void>;
}

export const useAiAssistant = create<AiAssistantState>((set, get) => ({
  status: "idle",
  text: "",
  imageUrl: null,
  error: null,

  reset: () => set({ status: "idle", text: "", imageUrl: null, error: null }),

  streamText: async (feature, input) => {
    if (get().status === "streaming") return;
    set({ status: "streaming", text: "", error: null });

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "text", feature, input }),
      });

      if (!res.ok || !res.body) {
        const message =
          (await res.json().catch(() => null))?.message ?? "AI request failed";
        set({ status: "error", error: message });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        set((s) => ({ text: s.text + chunk }));
      }

      set({ status: "idle" });
    } catch (error) {
      set({
        status: "error",
        error: error instanceof Error ? error.message : "AI request failed",
      });
    }
  },

  generateImage: async (prompt) => {
    if (get().status === "generating-image") return;
    set({ status: "generating-image", imageUrl: null, error: null });

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "image", prompt }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.image) {
        set({ status: "error", error: json?.message ?? "Image generation failed" });
        return;
      }

      set({ status: "idle", imageUrl: json.image as string });
    } catch (error) {
      set({
        status: "error",
        error: error instanceof Error ? error.message : "Image generation failed",
      });
    }
  },
}));
