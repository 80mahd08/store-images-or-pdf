import { getAuth } from "@clerk/nextjs/server";
import { initEdgeStore } from "@edgestore/server";
// Changed this import to use next/app instead of express
import { CreateContextOptions } from "@edgestore/server/adapters/next/app";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

type Context = {
  userId: string;
  userRole: "user";
};

// Updated parameter to use Next.js adapter's context options
function createContext({ req }: CreateContextOptions): Context {
  // Get the authentication state from Clerk
  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error("Unauthorized - Please log in");
  }

  return {
    userId: userId,
    userRole: "user",
  };
}

const es = initEdgeStore.context<Context>().create();
/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  isProtected: es
    .fileBucket()
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({ OR: [{ userId: { path: "owner" } }] }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
