// src/types/chat.ts

export type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};