/**
 * AI assistant agent endpoint. Receives a chat history and returns
 * a streamed assistant message. Mock implementation for the sandbox.
 */
export async function POST(req: Request) {
  const { messages } = await req.json();

  await new Promise((resolve) => setTimeout(resolve, 600));

  const lastMessage = messages[messages.length - 1]?.content ?? "";

  let response = "I'm your TaskPilot AI assistant. Here's what I found:";

  if (lastMessage.toLowerCase().includes("project")) {
    response = "You have 5 active projects. The most recent is **Customer Onboarding Flow**, which has 5 tasks — 2 in progress and 1 in review. Would you like a detailed breakdown?";
  } else if (lastMessage.toLowerCase().includes("overdue") || lastMessage.toLowerCase().includes("late")) {
    response = "You have **3 overdue tasks** across your projects:\n\n1. \"Write SEO meta content\" (Website Redesign) — 2 days late\n2. \"Implement offline mode\" (Mobile App v2) — 1 day late\n3. \"Slack webhook notifications\" (API Integration) — 3 days late\n\nWould you like me to reassign or reschedule any of these?";
  } else if (lastMessage.toLowerCase().includes("task")) {
    response = "You currently have **20 open tasks** assigned across 5 projects. 4 are high priority. Would you like me to summarize the most critical ones?";
  } else if (lastMessage.toLowerCase().includes("help") || lastMessage.toLowerCase().includes("what can")) {
    response = "I can help you with:\n\n• **Project status** — \"What's the status of Website Redesign?\"\n• **Overdue tasks** — \"Which tasks are overdue?\"\n• **Task summaries** — \"Summarize my open tasks\"\n• **Team workload** — \"Who has the most tasks?\"\n\nJust ask away!";
  } else {
    response = `I understand you're asking about: "${lastMessage}"\n\nAs your AI assistant, I can help analyze your projects and tasks. Could you be more specific about what you'd like to know? For example, try asking about overdue tasks, project status, or team workload.`;
  }

  return Response.json({ message: response });
}
