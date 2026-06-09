import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  generatePosts,
  generateCaptions,
  generateHashtags,
  rewritePost,
  generateCTA,
  generateCalendarPlan,
} from "@/lib/openai";

const schema = z.object({
  tool: z.enum(["posts", "captions", "hashtags", "rewriter", "cta", "calendar"]),
  industry: z.string().optional(),
  audience: z.string().optional(),
  tone: z.string().optional(),
  topic: z.string().optional(),
  count: z.number().min(1).max(10).optional(),
  text: z.string().optional(),
  days: z.number().optional(),
});

// Rate limiting (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (limit.count >= 10) return false;
  limit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json({ message: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const data = schema.parse(body);

    let result: unknown;

    switch (data.tool) {
      case "posts":
        result = await generatePosts(
          data.industry ?? "General",
          data.audience ?? "General audience",
          data.tone ?? "Professional",
          data.count ?? 3
        );
        break;
      case "captions":
        result = await generateCaptions(
          data.topic ?? "",
          data.tone ?? "Professional",
          data.count ?? 5
        );
        break;
      case "hashtags":
        result = await generateHashtags(
          data.topic ?? "",
          data.industry ?? "General",
          data.count ?? 20
        );
        break;
      case "rewriter":
        if (!data.text) {
          return NextResponse.json({ message: "Text is required for rewriter" }, { status: 400 });
        }
        result = await rewritePost(data.text, data.tone ?? "Professional");
        break;
      case "cta":
        result = await generateCTA(
          data.topic ?? "",
          data.audience ?? "General",
          data.count ?? 5
        );
        break;
      case "calendar":
        result = await generateCalendarPlan(
          data.industry ?? "General",
          data.audience ?? "General audience",
          data.days ?? 7
        );
        break;
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
    }
    console.error("AI generate error:", error);
    return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
  }
}
