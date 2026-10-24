import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { streamGroqText, type AiTextFeature } from "@/lib/ai/groq";
import { generateImage } from "@/lib/ai/gemini";

// Single AI router: text streaming (Groq) and image generation (Google Gen AI)
// are both served from this one file, selected by the request payload `mode`.
export const runtime = "nodejs";

const textSchema = z.object({
  mode: z.literal("text").optional().default("text"),
  feature: z.enum([
    "posts",
    "captions",
    "hashtags",
    "rewriter",
    "cta",
    "calendar",
    "chat",
  ]),
  input: z.string().min(2).max(4000),
});

const imageSchema = z.object({
  mode: z.literal("image"),
  prompt: z.string().min(2).max(2000),
});

const schema = z.union([imageSchema, textSchema]);

// Simple in-memory, per-user rate limit (serverless-safe per instance).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { message: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    // Image branch — Google Gen AI returns a single image as a data URL.
    if (parsed.data.mode === "image") {
      const { dataUrl, mimeType } = await generateImage(parsed.data.prompt);
      return NextResponse.json({ image: dataUrl, mimeType });
    }

    // Text branch — stream Groq tokens back to the client as they arrive.
    const { feature, input } = parsed.data;
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of streamGroqText(feature as AiTextFeature, input)) {
            controller.enqueue(encoder.encode(delta));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
  }
}
