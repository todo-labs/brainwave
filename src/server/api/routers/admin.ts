import * as z from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { modifySubtopicSchema, paginationSchema } from "@/server/schemas";
import { cleanEnum } from "@/lib/utils";
import { ReportStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { utapi } from "@/server/uploadthing";

export const adminRouter = createTRPCRouter({
  totalUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count();
  }),
  totalQuizzes: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.quiz.count();
  }),
  totalReports: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.report.count();
  }),
  removeUser: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({
        where: { id: input },
      });
    }),
  allUsers: adminProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const [users, count] = await Promise.all([
        ctx.prisma.user.findMany({
          take: input.pageSize,
          skip: input.pageIndex * input.pageSize,
          where: {
            OR: [
              {
                name: {
                  contains: input.query || "",
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: input.query || "",
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            quizzes: true,
          },
        }),
        ctx.prisma.user.count() || 0,
      ]);
      return { users, count };
    }),
  allQuizzes: adminProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const quizzes = await ctx.prisma.quiz.findMany({
        take: input.pageSize,
        skip: input.pageIndex * input.pageSize,
        include: {
          user: true,
          questions: true,
        },
        orderBy: {
          createdAt: !input.sortAsc ? "asc" : "desc",
        },
      });
      const count = (await ctx.prisma.quiz.count()) || 0;
      return { quizzes, count };
    }),
  allReports: adminProcedure
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const reports = await ctx.prisma.report.findMany({
        where: {
          txt: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
      });

      const count = await ctx.prisma.report.count();

      return {
        reports: reports || [],
        count: count || 0,
      };
    }),
  quizBreakdown: adminProcedure.query(async ({ ctx }) => {
    const results = await ctx.prisma.quiz.groupBy({
      by: ["topic"],
      _count: {
        topic: true,
      },
    });
    return results.map((result) => ({
      label: cleanEnum(result.topic),
      amount: result._count.topic,
    }));
  }),
  addCredits: adminProcedure
    .input(z.object({ id: z.string().cuid(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: { credits: { increment: input.credits } },
      });
    }),
  removeQuiz: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.quiz.delete({
        where: { id: input },
      });
    }),
  averageScore: adminProcedure.query(async ({ ctx }) => {
    const { _avg } = await ctx.prisma.quiz.aggregate({
      _avg: {
        score: true,
      },
    });
    return Number(_avg.score || 0).toFixed(2);
  }),
  removeReport: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.report.delete({
        where: {
          id: input,
        },
      });
    }),
  updateTicketStatus: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: z.nativeEnum(ReportStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.report.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  addSubtopic: adminProcedure
    .input(modifySubtopicSchema)
    .mutation(async ({ input, ctx }) => {
      const topic = await ctx.prisma.metadata.findUniqueOrThrow({
        where: {
          topic: input.topic || undefined,
        },
      });
      const isUnique = !topic.subtopics.includes(input.subtopic);
      if (!isUnique) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subtopic already exists",
        });
      }
      topic.subtopics.push(input.subtopic);
      return await ctx.prisma.metadata.update({
        where: {
          topic: input.topic || undefined,
        },
        data: {
          subtopics: topic.subtopics,
        },
      });
    }),
  removeSubtopic: adminProcedure
    .input(modifySubtopicSchema)
    .mutation(async ({ input, ctx }) => {
      const topic = await ctx.prisma.metadata.findUniqueOrThrow({
        where: {
          topic: input.topic || undefined,
        },
      });
      topic.subtopics = topic.subtopics.filter(
        (subtopic) => subtopic !== input.subtopic
      );
      return await ctx.prisma.metadata.update({
        where: {
          topic: input.topic || undefined,
        },
        data: {
          subtopics: topic.subtopics,
        },
      });
    }),
  allDocuments: adminProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const documents = await ctx.prisma.document.findMany({
        take: input.pageSize,
        skip: input.pageIndex * input.pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });
      const count = await ctx.prisma.document.count();
      return { documents, count };
    }),
  deleteDocument: adminProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      // NOTE: should use a transaction here
      return await Promise.all([
        utapi.deleteFiles(input),
        ctx.prisma.document.delete({
          where: { key: input },
        })
      ]);
    }),
});
