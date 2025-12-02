// src/app/chat/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { redirect } from "next/navigation";
import ChatInterface from "../_components/chatbot/ChatInterface";
import TRPCProvider from "../TRPCProvider"; // Import TRPCProvider

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <TRPCProvider>
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="flex h-full w-full max-w-4xl">
          <ChatInterface />
        </div>
      </div>
    </TRPCProvider>
  );
}