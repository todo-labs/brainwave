import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { quizRouter } from "@/server/api/routers/quiz";
import { checkoutRouter } from "./routers/checkout";
import { adminRouter } from "./routers/admin";
import { metaRouter } from "./routers/meta";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  quiz: quizRouter,
  checkout: checkoutRouter,
  admin: adminRouter,
  meta: metaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
