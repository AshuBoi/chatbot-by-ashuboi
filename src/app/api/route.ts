import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

type IncomingMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT =
  "You are AshuBoi's ChatterBot, a friendly portfolio assistant for Ashutosh Jha (AshuBoi). " +
  "Keep answers concise, practical, and upbeat. If asked about AshuBoi's work, mention event-driven " +
  "systems, Spring Boot microservices, Kafka, and clean API design when relevant.";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (
    !apiKey ||
    apiKey === "your api key" ||
    apiKey.includes("your-key-here") ||
    apiKey.startsWith("sk-your")
  ) {
    return null;
  }
  return new OpenAI({ apiKey });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: IncomingMessage[] };
    const messages = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    const sanitized: ChatCompletionMessageParam[] = messages
      .filter(
        (m) =>
          m &&
          typeof m.content === "string" &&
          m.content.trim().length > 0 &&
          (m.role === "user" || m.role === "assistant" || m.role === "system")
      )
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    if (sanitized.length === 0) {
      return NextResponse.json({ error: "No valid messages provided" }, { status: 400 });
    }

    const client = getClient();
    if (!client) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured. Copy .env.example to .env.local and add your key.",
        },
        { status: 503 }
      );
    }

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
      temperature: 0.7,
      max_tokens: 600,
    });

    const output = completion.choices[0]?.message;
    if (!output?.content) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
    }

    return NextResponse.json({
      output: {
        role: "assistant" as const,
        content: output.content,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    console.error("Chat API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
