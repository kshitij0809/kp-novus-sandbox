"use client";

import { useEffect } from "react";
import { AIAssistantChatPanel } from "@/components/help/ai-assistant-chat-panel";
import { track } from "@/lib/pendo";

export default function HelpPage() {
  useEffect(() => {
    document.title = "TaskPilot — AI Assistant";
    // PENDO: AI assistant opened
    track("ai_assistant_opened", { source: "help_page" });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground text-sm">Ask questions about your projects, get summaries, or get help.</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <AIAssistantChatPanel />
      </div>
    </div>
  );
}
