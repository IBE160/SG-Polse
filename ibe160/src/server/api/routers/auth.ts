import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getUserRole: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user.role;
  }),
});
