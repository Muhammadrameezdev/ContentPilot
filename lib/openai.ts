import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generatePosts(
  industry: string,
  audience: string,
  tone: string,
  count: number = 3
) {
  const systemPrompt = `You are an expert social media copywriter specializing in Facebook content. 
Generate engaging, high-converting Facebook posts. Each post should:
- Be optimized for the Facebook algorithm
- Include relevant emojis naturally
- Have a strong hook in the first line
- Include a clear call-to-action
- Be appropriate for the specified tone and goal

Respond in JSON format with an array of objects under a "posts" key, each containing:
- text: the full post text
- hashtags: array of relevant hashtags (5-10)
- emoji: a single emoji that best represents the post
- engagementTip: a brief tip for maximizing engagement with this post`;

  const userPrompt = `Generate ${count} Facebook post(s) with these parameters:
- Industry/Niche: ${industry}
- Target Audience: ${audience}
- Tone: ${tone}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content);
}

export async function generateCaptions(
  topic: string,
  tone: string = "Professional",
  count: number = 5
) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Generate engaging Facebook captions in a ${tone} tone. Respond in JSON with a "captions" key containing an array of caption strings.`,
      },
      {
        role: "user",
        content: `Generate ${count} caption variations for: ${topic}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

export async function generateHashtags(
  topic: string,
  industry: string = "General",
  count: number = 20
) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Generate relevant hashtags for Facebook posts. Respond in JSON with a "hashtags" key containing an array of ${count} hashtag strings (without #).`,
      },
      {
        role: "user",
        content: `Topic: ${topic}\nIndustry: ${industry}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

export async function rewritePost(originalPost: string, tone: string = "Professional") {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Rewrite and improve the following Facebook post in a ${tone} tone. Make it more engaging and algorithm-friendly. Respond in JSON with: { "rewritten": string, "improvements": string[] }`,
      },
      { role: "user", content: originalPost },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

export async function generateCTA(
  topic: string,
  audience: string = "General",
  count: number = 5
) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Generate compelling call-to-action phrases for Facebook posts targeting ${audience}. Respond in JSON with a "ctas" key containing an array of CTA strings.`,
      },
      {
        role: "user",
        content: `Generate ${count} CTA variations for topic: ${topic}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

export async function generateCalendarPlan(
  industry: string,
  audience: string,
  days: number = 7
) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Generate a content calendar plan for Facebook. Respond in JSON with a "plan" key containing an array of objects: { day: number, topic: string, caption: string, contentType: string, bestTime: string }`,
      },
      {
        role: "user",
        content: `Create a ${days}-day content calendar for ${industry} industry targeting ${audience}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}
