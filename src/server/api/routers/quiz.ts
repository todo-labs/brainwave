import { z } from "zod";
import { Topics } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createQuizSchema, gradeQuizSchema } from "@/server/validators";
import { TRPCError } from "@trpc/server";
import { genQuiz, genReviewNotes, gradeQuiz } from "@/lib/ai/quiz";
import { env } from "@/env.mjs";

export const quizRouter = createTRPCRouter({
  getPastExams: protectedProcedure
    .input(
      z.object({
        topic: z.nativeEnum(Topics),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.quiz.findMany({
        where: {
          user: {
            email: ctx.session.user.email as string,
          },
          topic: input.topic,
        },
      });
    }),
  createExam: protectedProcedure
    .input(createQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: {
            email: ctx.session.user.email as string,
          },
        });

        if (!user || user.credits < env.CREDITS_PER_QUIZ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not enough credits",
          });
        }

        const quiz = await genQuiz(input);

        if (!quiz) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate quiz",
          });
        }

        const data = await prisma.quiz.create({
          data: {
            topic: input.subject,
            difficulty: input.difficulty,
            questions: {
              createMany: {
                data: quiz.map((q) => ({
                  label: q.question,
                  solution: q.answer,
                  options: q.options ?? [],
                  type: q.type,
                  answer: "",
                })),
              },
            },
            user: {
              connect: {
                email: ctx.session.user.email as string,
              },
            },
          },
        });

        await prisma.user.update({
          where: {
            email: ctx.session.user.email as string,
          },
          data: {
            credits: {
              decrement: env.CREDITS_PER_QUIZ,
            },
          },
        });

        return data;
      });

      // get questions
      const questions = await ctx.prisma.questions.findMany({
        where: {
          quizId: data.id,
        },
      });

      return {
        id: data.id,
        topic: data.topic,
        difficulty: data.difficulty,
        questions: questions.map((q) => {
          return {
            label: q.label,
            options: q.options,
            type: q.type,
          };
        }),
      };
    }),
  gradeExam: protectedProcedure
    .input(gradeQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
        },
        include: {
          questions: true,
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      if (quiz.score > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quiz already graded",
        });
      }

      const result = await gradeQuiz(
        quiz.topic,
        quiz.difficulty,
        quiz.questions.map((q, index) => ({
          ...q,
          answer: input.answers[index] ?? "NOT_SUPPLIED",
        }))
      );

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to grade quiz",
        });
      }

      const score = result.reduce((acc, curr) => {
        if (curr.correct) return acc + 1;
        return acc;
      }, 0);

      const reviewNotes = await genReviewNotes(
        result,
        {
          subject: quiz.topic,
          difficulty: quiz.difficulty,
          score,
        },
        ctx.session.user.name || "[NOT_SUPPLIED]"
      );

      await ctx.prisma.quiz.update({
        where: { id: input.quizId },
        data: { score, reviewNotes },
      });
    }),
  getQuiz: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: { id: input.quizId },
        include: { questions: true },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      return quiz;
    }),
});
