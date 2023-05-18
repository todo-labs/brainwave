import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    OPEN_API_KEY: z.string().min(1).optional(),
    EMAIL_HOST: z.string().min(1).optional(),
    EMAIL_PORT: z.string().min(1).optional(),
    EMAIL_USER: z.string().min(1).optional(),
    EMAIL_PASSWORD: z.string().min(1).optional(),
    EMAIL_FROM: z.string().min(1).optional(),
    PEXELS_API_KEY: z.string().min(1).optional(),
    MAX_QUESTIONS_PER_QUIZ: z.string().regex(/^\d+$/).optional(),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEB_HOOK_SECRET: z.string().min(1).optional(),
    PRICE_ID: z.string().min(1).optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_MAX_QUESTIONS_PER_QUIZ: z.string().regex(/^\d+$/).optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    OPEN_API_KEY: process.env.OPEN_API_KEY,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
    MAX_QUESTIONS_PER_QUIZ: process.env.MAX_QUESTIONS_PER_QUIZ,
    NEXT_PUBLIC_MAX_QUESTIONS_PER_QUIZ: process.env.MAX_QUESTIONS_PER_QUIZ,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEB_HOOK_SECRET: process.env.STRIPE_WEB_HOOK_SECRET,
    PRICE_ID: process.env.PRICE_ID,
  },
});
