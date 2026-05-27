interface PendoTrackAgentMetadata {
  agentId: string;
  conversationId: string;
  messageId: string;
  content: string;
  modelUsed?: string;
  suggestedPrompt?: boolean;
  toolsUsed?: string[];
  fileUploaded?: boolean;
}

interface Pendo {
  track: (event: string, properties?: Record<string, unknown>) => void;
  trackAgent: (
    eventType: "prompt" | "agent_response" | "user_reaction",
    metadata: PendoTrackAgentMetadata
  ) => void;
  initialize: (options: Record<string, unknown>) => void;
  identify: (options: Record<string, unknown>) => void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    pendo?: Pendo;
  }
}

export {};
