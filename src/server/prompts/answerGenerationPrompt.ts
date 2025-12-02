import { type ChatMessage } from "~/types/chat";
import { type RecordMetadata } from '@pinecone-database/pinecone'; // Import RecordMetadata

export function generateAnswerPrompt(
  question: string,
  relevantChunks: Array<{ id: string; score: number; metadata: RecordMetadata }>,
  conversationHistory: ChatMessage[] = [],
): string {
  let prompt = `You are a helpful and concise AI assistant for students. Answer the following question based ONLY on the provided context. If you cannot find the answer in the context, state that you don't know, but do not make up an answer.
Your answer MUST include citations to the source documents in the format "Source: [Document Name], [Page Number (if available)]". If a URL is available, also include it as a clickable link.
Keep your answer as short and direct as possible.

---
Conversation History:
`;

  if (conversationHistory.length > 0) {
    conversationHistory.forEach((message) => {
      prompt += `${message.sender}: ${message.text}\n`;
    });
  } else {
    prompt += "No previous conversation.\n";
  }

  // Extract context content and create source citations
  const contextAndSources = relevantChunks.map(chunk => {
    const text = (chunk.metadata as { text: string }).text || "";
    const documentName = (chunk.metadata as { documentName?: string }).documentName || "Unknown Document";
    const pageNumber = (chunk.metadata as { pageNumber?: number }).pageNumber;
    const url = (chunk.metadata as { url?: string }).url;

    let source = `Source: ${documentName}`;
    if (pageNumber) {
      source += `, Page ${pageNumber}`;
    }
    if (url) {
      source += ` (${url})`;
    }

    return `${text}\n(${source})`;
  }).join("\n\n");


  prompt += `
---
Context (with sources):
${contextAndSources}

---
Question: ${question}

Answer:`;

  return prompt;
}
