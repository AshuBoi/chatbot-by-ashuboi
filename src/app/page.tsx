"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME: ChatMessage = {
  role: "assistant",
  content: "Yo — AshuBoi's ChatterBot here. Ask me anything.",
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function callGetResponse() {
    const content = theInput.trim();
    if (!content || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setTheInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((prev) => [...prev, data.output as ChatMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I hit an error: ${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void callGetResponse();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void callGetResponse();
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-4 py-8 sm:px-8">
      <header className="w-full max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/80">Portfolio demo</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-emerald-50 sm:text-5xl">
          AshuBoi&apos;s ChatterBot
        </h1>
        <p className="mt-2 text-sm text-emerald-100/70">
          Next.js + OpenAI chat API. Set <code className="text-emerald-200">OPENAI_API_KEY</code> in{" "}
          <code className="text-emerald-200">.env.local</code>.
        </p>
      </header>

      <section className="flex h-[35rem] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-emerald-900/60 bg-slate-900/80 shadow-xl shadow-black/30">
        <div className="flex h-full flex-col gap-3 overflow-y-auto px-4 py-6">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
              className={`w-max max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "assistant"
                  ? "self-start bg-emerald-100 text-slate-900"
                  : "self-end bg-emerald-700 text-emerald-50"
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="w-max self-start rounded-2xl bg-emerald-100/80 px-4 py-3 text-sm text-slate-700">
              Thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="border-t border-emerald-900/50 bg-slate-950/50 p-4">
          <div className="flex gap-2">
            <textarea
              value={theInput}
              onChange={(event) => setTheInput(event.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              placeholder="Ask something…"
              className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-emerald-900/50 bg-slate-900 px-3 py-2 text-sm text-emerald-50 outline-none ring-emerald-500/40 placeholder:text-emerald-100/40 focus:ring-2"
            />
            <button
              type="submit"
              disabled={isLoading || !theInput.trim()}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
        </form>
      </section>
    </main>
  );
}
