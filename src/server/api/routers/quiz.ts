import { z } from "zod";
import sentiment from "sentiment";
import { Role, Topics } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createQuizSchema,
  gradeQuizSchema,
} from "@/server/schemas";
import { TRPCError } from "@trpc/server";

import {
  genQuiz,
  genReviewNotes,
  gradeQuiz,
  reviewComment,
} from "@/lib/ai/quiz";
import { env } from "@/env.mjs";
import { sendEmail } from "@/lib/mailer";
import type { Languages } from "types";

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
            didUserQuit: false,
            topic: input.topic,
          },
        });
      } catch (e) {
        console.error(e);
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

        if (input.notes) {
          const score = new sentiment().analyze(input.notes).score;
          if (score < 0) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Please provide something more constructive.",
            });
          }

          const { approved, suggestion } = await reviewComment(input.notes, {
            subject: input.subject,
            subtopic: input.subtopic,
          });

          if (!approved) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                suggestion ||
                "Your notes were found to be inappropriate. Please revise and resubmit.",
            });
          }
        }

        const quiz = await genQuiz({ ...input, lang: ctx.session.user.lang });

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
              language: ctx.session.user.lang,
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
        console.error(e);
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

        if (quiz.score > 0) return;

        const result = await gradeQuiz(
          quiz.topic,
          quiz.difficulty,
          quiz.questions.map((q, index) => ({
            ...q,
            answer: input.answers[index] ?? "Anonymous",
          })),
          (quiz.language as Languages) || "en"
        );

        if (!result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to grade quiz",
          });
        }

        const correctAnswers = result.filter((answer) => answer.correct);
        const score = Math.floor((correctAnswers.length / result.length) * 100);

        await Promise.all([
          ctx.prisma.quiz.update({
            where: { id: input.quizId },
            data: { score },
          }),
          sendEmail(ctx.session.user.email as string, "quizCompletion", {
            name: ctx.session.user.name || "Anonymous",
            score,
            topic: quiz.topic,
            subtopic: quiz.subtopic,
          }),
        ]);
      } catch (e) {
        console.error(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to grade quiz",
        });
      }
    }),
  genReviewNotes: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .mutation(async ({ input, ctx }) => {
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

      if (!quiz.score) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quiz not graded",
        });
      }

      if (!!quiz.reviewNotes) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Review notes already generated",
        });
      }

      const results = quiz?.questions.map((q) => ({
        question: q.label,
        type: q.type,
        studentAnswer: q.answer || "NOT ANSWERED",
        answer: q.solution,
      }));

      const reviewNotes = await genReviewNotes(
        results,
        {
          subject: quiz.topic,
          subtopic: quiz.subtopic,
          difficulty: quiz.difficulty,
          score: quiz.score,
        },
        ctx.session.user.name || "Anonymous",
        ctx.session.user.lang || "en"
      );

      await ctx.prisma.quiz.update({
        where: { id: input.quizId },
        data: { reviewNotes },
      });
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
        console.error(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get quiz",
        });
      }
    }),
  quitQuiz: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const quiz = await ctx.prisma.quiz.findUnique({
          where: { id: input.quizId },
        });

        if (!quiz) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Quiz not found",
          });
        }

        if (quiz.score) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Quiz already graded",
          });
        }

        await ctx.prisma.quiz.update({
          where: { id: input.quizId },
          data: { didUserQuit: true },
        });
      } catch (e) {
        console.error(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to quit quiz",
        });
      }
    }),
});
