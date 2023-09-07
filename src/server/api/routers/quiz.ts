import { z } from "zod";
import { Role, Topics } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createQuizSchema, gradeQuizSchema } from "@/server/schemas";
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
      try {
        return await ctx.prisma.quiz.findMany({
          where: {
            user: {
              email: ctx.session.user.email as string,
            },
            topic: input.topic,
          },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get past exams",
        });
      }
    }),
  createExam: protectedProcedure
    .input(createQuizSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: revisit this no credits should be removed if everything fails move to end
        await ctx.prisma.$transaction(async (prisma) => {
          const user = await prisma.user.findUnique({
            where: {
              email: ctx.session.user.email as string,
            },
          });

          if (
            !user ||
            (user.credits < env.CREDITS_PER_QUIZ && user.role != Role.ADMIN)
          ) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Not enough credits",
            });
          }
        });

        const quiz = await genQuiz(input);

        if (!quiz) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate quiz",
          });
        }

        const [data, _] = await Promise.all([
          ctx.prisma.quiz.create({
            data: {
              topic: input.subject,
              difficulty: input.difficulty,
              subtopic: input.subtopic,
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
            include: {
              questions: true,
            },
          }),
          ctx.prisma.user.update({
            where: {
              email: ctx.session.user.email as string,
            },
            data: {
              credits: {
                decrement:
                  ctx.session.user.role === Role.ADMIN
                    ? 0
                    : env.CREDITS_PER_QUIZ,
              },
            },
          }),
        ]);

        return {
          id: data.id,
          topic: data.topic,
          difficulty: data.difficulty,
          questions: data.questions.map((q) => {
            return {
              label: q.label,
              options: q.options,
              type: q.type,
            };
          }),
        };
      } catch (e) {
        console.log(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create quiz",
        });
      }
    }),
  gradeExam: protectedProcedure
    .input(gradeQuizSchema)
    .mutation(async ({ ctx, input }) => {
      try {
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
            answer: input.answers[index] ?? "[NOT_SUPPLIED]",
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
      } catch (e) {
        console.log(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to grade quiz",
        });
      }
    }),
  getQuiz: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
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
      } catch (e) {
        console.log(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get quiz",
        });
      }
    }),
});
