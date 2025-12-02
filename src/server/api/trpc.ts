// src/server/api/trpc.ts
import { TRPCError } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "../auth";
import { prisma } from "../db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * The `context` is kind of like a connection between the client and the server, letting you pass information
 * that you enrich here and use in your routers.
 *
 * `createContext` is what you call to create a fully prepared context. It passes an empty object if you're
 * just testing, or the actual HTTP request + response when you're running on a server.
 *
 * Once you've got a context, you can use it as a 'middleware' for your procedures to access things like
 * your database, current session, etc.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    prisma,
    session,
    headers: opts.headers,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafe errors on the client if your procedures fail.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURES
 *
 * Once an app is created, you can define your backend API.
 *
 * API will be available via the `createTRPCRouter` and `procedure` exports.
 */

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authenticated.
 *
 * @see https://trpc.io/docs/procedures
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to only be accessible to authenticated users, use this. It verifies
 * that a user is logged in and returns their session. If they're not, it throws an Unauthorized error.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Teacher (authenticated and role is TEACHER) procedure
 *
 * If you want a query or mutation to only be accessible to authenticated users with the TEACHER role,
 * use this. It verifies that a user is logged in, has the TEACHER role and returns their session.
 * If they're not, it throws an Unauthorized error.
 */
export const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'TEACHER') {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be a teacher to perform this action." });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
