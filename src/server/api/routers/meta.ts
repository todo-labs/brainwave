import { subMonths } from "date-fns";
import * as z from "zod";

import { shortHash } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { reportSchema } from "@/server/schemas";
import { Topics } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const metaRouter = createTRPCRouter({
  getSubtopics: protectedProcedure
    .input(
      z.object({
        topic: z.nativeEnum(Topics).nullable(),
      })
    )
    .query(async ({ input, ctx }) => {
      const subtopics = await ctx.prisma.metadata.findMany({
        where: {
          topic: input.topic ?? undefined,
        },
        select: {
          subtopics: true,
        },
      });
      return subtopics
        .flatMap((meta) => meta.subtopics)
        .sort((a, b) => a.localeCompare(b));
    }),
  leaderboard: protectedProcedure.query(async ({ ctx }) => {
    // top 10 users with the highest score in the past 30 days
    const leaderboard = await ctx.prisma.quiz.findMany({
      select: {
        user: true,
        score: true,
        subtopic: true,
        topic: true,
      },
      where: {
        createdAt: {
          gt: subMonths(new Date(), 1),
        },
      },
      orderBy: {
        score: "desc",
      },
      take: 5,
    });

    return leaderboard.map((quiz, index) => ({
      name: quiz.user.name ?? `Anonymous #${index + 1}`,
      topic: quiz.topic,
      subtopic: quiz.subtopic,
      score: quiz.score,
    }));
  }),
  report: protectedProcedure
    .input(reportSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const ticketNumber: string = [
          shortHash(input.userAgent || "unknown"),
          shortHash(input.pageUrl || "unknown"),
          new Date().getTime().toString().slice(-4),
        ].join("-");
        await ctx.prisma.report.create({
          data: {
            ticketNumber,
            txt: input.message,
            type: input.issueType,
            pageUrl: input.pageUrl || "",
            userAgent: input.userAgent,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message:
            "We encountered an issue while processing your request to report a bug. Please try again later, and we apologize for any inconvenience this may have caused.",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.document.findFirst({
        where: { key: input.key },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
    }),
});
