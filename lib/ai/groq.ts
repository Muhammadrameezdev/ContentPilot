import Groq from "groq-sdk";

// Active text stack is Groq (llama-3.3-70b-versatile). The legacy lib/openai.ts
// is intentionally not used anywhere.
export const GROQ_TEXT_MODEL = "llama-3.3-70b-versatile";

let client: Groq | null = null;

function getGroq(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");
    client = new Groq({ apiKey });
  }
  return client;
}

export type AiTextFeature =
  | "posts"
  | "captions"
  | "hashtags"
  | "rewriter"
  | "cta"
  | "calendar"
  | "chat";

const SYSTEM_PROMPTS: Record<AiTextFeature, string> = {
  posts: `You are an expert Facebook copywriter. Generate engaging, algorithm-friendly post ideas with a strong hook and a clear call-to-action. Use natural emojis. Keep each idea self-contained.`,
  captions: `You are a Facebook content expert. Write engaging caption variations for the given topic. Keep them punchy and scroll-stopping.`,
  hashtags: `Generate relevant Facebook hashtags for the given topic. Return them space separated, without commentary.`,
  rewriter: `Rewrite the given Facebook post to be more engaging, clear, and compelling while preserving its meaning.`,
  cta: `Write short, high-converting call-to-action phrases for the given product, service, or goal.`,
  calendar: `Create a Facebook content calendar for the given business or niche. For each day include a topic and a short caption idea.`,
  chat: `You are ContentPilot's helpful assistant. Answer questions about using ContentPilot, Facebook page management, content scheduling, team management, and billing. Be concise. Politely redirect unrelated questions back to ContentPilot topics.`,
};

export function getSystemPrompt(feature: AiTextFeature): string {
  return SYSTEM_PROMPTS[feature] ?? SYSTEM_PROMPTS.posts;
}

/**
 * Stream a Groq chat completion as token chunks. Yields the incremental text
 * deltas so callers can pipe them straight into a ReadableStream.
 */
export async function* streamGroqText(
  feature: AiTextFeature,
  input: string
): AsyncGenerator<string> {
  const stream = await getGroq().chat.completions.create({
    model: GROQ_TEXT_MODEL,
    stream: true,
    temperature: 0.8,
    max_tokens: feature === "calendar" ? 4000 : 1200,
    messages: [
      { role: "system", content: getSystemPrompt(feature) },
      { role: "user", content: input },
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

/** Non-streaming Groq completion, used when the caller wants the full text. */
export async function generateGroqText(
  feature: AiTextFeature,
  input: string
): Promise<{ content: string; tokensUsed: number }> {
  const completion = await getGroq().chat.completions.create({
    model: GROQ_TEXT_MODEL,
    temperature: 0.8,
    max_tokens: feature === "calendar" ? 4000 : 1200,
    messages: [
      { role: "system", content: getSystemPrompt(feature) },
      { role: "user", content: input },
    ],
  });

  return {
    content: completion.choices[0]?.message?.content ?? "",
    tokensUsed: completion.usage?.total_tokens ?? 0,
  };
}
