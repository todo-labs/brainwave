import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Topics } from "@prisma/client";
import * as z from "zod";

export const metaRouter = createTRPCRouter({
  getSubtopics: protectedProcedure
    .input(
      z.object({
        topic: z.nativeEnum(Topics),
      })
    )
    .query(async ({ input, ctx }) => {
      const subtopics = await ctx.prisma.metadata.findMany({
        where: {
          topic: input.topic,
        },
        select: {
          subtopics: true,
        },
      });
      return subtopics
        .flatMap((meta) => meta.subtopics)
        .sort((a, b) => a.localeCompare(b));
    }),
  addSubtopic: protectedProcedure
    .input(
      z.object({
        topic: z.nativeEnum(Topics),
        subtopic: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const topic = await ctx.prisma.metadata.findUniqueOrThrow({
        where: {
          topic: input.topic,
        },
      });

      topic.subtopics.push(input.subtopic);
      return await ctx.prisma.metadata.update({
        where: {
          topic: input.topic,
        },
        data: {
          subtopics: topic.subtopics,
        },
      });
    }),
});
