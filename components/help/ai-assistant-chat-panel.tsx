"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ThumbsUp, ThumbsDown, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/pendo";

declare global {
  interface Window {
    pendo?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
      trackAgent: (eventType: string, metadata: object) => void;
    };
  }
}

const AGENT_ID = "myuCDl_FOKPPron5JTAVlZxltlw";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m0",
    role: "assistant",
    content: "Hi! I'm your TaskPilot AI Assistant. I can help you with:\n\n• Summarizing project status\n• Finding overdue tasks\n• Generating task descriptions\n• Answering questions about your workspace\n\nWhat would you like to know?",
  },
];

export function AIAssistantChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: `m${Date.now()}`, role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // PENDO: AI assistant query sent
    track("ai_assistant_query_sent", { message_length: userMsg.content.length });

    // Pendo trackAgent: user prompt
    window.pendo?.trackAgent("prompt", {
      agentId: AGENT_ID,
      conversationId: conversationIdRef.current,
      messageId: userMsg.id,
      content: userMsg.content,
      suggestedPrompt: false,
    });

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();

      const assistantMsg: Message = { id: `m${Date.now() + 1}`, role: "assistant", content: data.message };
      setMessages((prev) => [...prev, assistantMsg]);

      // PENDO: AI assistant response received
      track("ai_assistant_response_received", { response_length: data.message.length });

      // Pendo trackAgent: agent response
      window.pendo?.trackAgent("agent_response", {
        agentId: AGENT_ID,
        conversationId: conversationIdRef.current,
        messageId: assistantMsg.id,
        content: assistantMsg.content,
      });
    } catch (e) {
      setMessages((prev) => [...prev, { id: `err${Date.now()}`, role: "assistant", content: "Sorry, I ran into an issue. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageId: string, positive: boolean) => {
    // PENDO: AI assistant feedback given
    track("ai_assistant_feedback_given", { message_id: messageId, positive });

    // Pendo trackAgent: user reaction
    window.pendo?.trackAgent("user_reaction", {
      agentId: AGENT_ID,
      conversationId: conversationIdRef.current,
      messageId,
      content: positive ? "positive" : "negative",
    });
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-indigo-600" />
              </div>
            )}
            <div className={`max-w-lg ${msg.role === "user" ? "order-first" : ""}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-muted rounded-tl-sm"
              }`}>
                {msg.content}
              </div>
              {msg.role === "assistant" && (
                <div className="flex gap-1 mt-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleFeedback(msg.id, true)}>
                    <ThumbsUp size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleFeedback(msg.id, false)}>
                    <ThumbsDown size={12} />
                  </Button>
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-indigo-600" />
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pb-6">
        <div className="flex gap-2 bg-background border border-border rounded-2xl px-4 py-2.5 shadow-sm">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your workspace…"
            className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 text-sm p-0 min-h-[24px] max-h-[120px] bg-transparent"
            rows={1}
          />
          <Button size="icon" className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 self-end" onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send size={14} />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">AI responses are mocked for demonstration purposes.</p>
      </div>
    </div>
  );
}
