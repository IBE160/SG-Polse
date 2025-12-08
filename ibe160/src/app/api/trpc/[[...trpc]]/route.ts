console.log('--- ROUTE.TS FILE LOADED ---'); // <--- ADD THIS

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a request.
 */
const createContext = async (req: Request) => {
  console.log('--- Route handler: createContext called ---'); // <--- ADD THIS
  return createTRPCContext({ headers: req.headers });
};

const handler = (req: Request) => {
  console.log('--- ENTERED TRPC ROUTE HANDLER ---'); // <--- ADD THIS
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter, // <--- Add log for appRouter here
    createContext: () => createContext(req),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
              error.cause, // <--- ADD THIS to log the original error cause
            );
          }
        : undefined,
  });
};

console.log('tRPC route handler initialized with router:', appRouter); // <--- ADD THIS HERE

export { handler as GET, handler as POST };

