// src/server/api/root.ts
import { createTRPCRouter } from "./trpc";
import { chatbotRouter } from "./routers/chatbot";
import { teacherRouter } from "./routers/teacher";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chatbot: chatbotRouter,
  teacher: teacherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
