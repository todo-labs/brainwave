import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { render } from "@react-email/render";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { createTransport } from "nodemailer";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { Languages } from "@/lib/utils";
import { MagicLinkEmail } from "@/emails/magic-link";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      lang: Languages;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      session.user.role = token.role as Role;
      session.user.id = token.id as string;
      session.user.lang = token.lang as Languages;
      return session;
    },
    async jwt({ token }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: { role: true, id: true, lang: true },
      });
      if (dbUser) {
        token.role = dbUser.role;
        token.id = dbUser.id;
        token.lang = dbUser.lang as Languages;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_HOST,
        port: Number(env.EMAIL_PORT),
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
        secure: false,
      },
      from: env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        try {
          const transport = createTransport(server);
          await transport.sendMail({
            to: email,
            from: from,
            subject: "Sign in to Brainwave",
            html: render(MagicLinkEmail({ url })),
          });
        } catch (error) {
          console.error("SEND_VERIFICATION_EMAIL_ERROR", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
    signIn: "/auth/sign-in",
  },
  debug: env.NODE_ENV === "development",
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
