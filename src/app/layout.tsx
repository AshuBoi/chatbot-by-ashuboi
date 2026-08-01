import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AshuBoi ChatterBot",
  description: "Portfolio chatbot by AshuBoi — Next.js + OpenAI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#134e4a_0%,_#020617_55%)] text-emerald-50 antialiased">
        {children}
      </body>
    </html>
  );
}
