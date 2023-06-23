import { z } from "zod";
import { Topics } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createQuizSchema } from "@/server/validators";
import { genQuiz } from "@/lib/ai";
import { TRPCError } from "@trpc/server";

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
          email: ctx.session.user.email as string,
          topic: input.topic,
        },
      });
    }),
  createExam: protectedProcedure
    .input(createQuizSchema)
    .mutation(async ({ ctx, input }) => {
      const quiz = await genQuiz(input);

      if (!quiz) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate quiz",
        });
      }

      const data = await ctx.prisma.quiz.create({
        data: {
          topic: input.subject,
          difficulty: input.difficulty,
          questions: {
            create: quiz.map((q) => ({
              question: q.question,
              answer: q.answer,
              options: q.options ?? [],
              type: q.type,
            })),
          },
          user: {
            connect: {
              email: ctx.session.user.email as string,
            },
          },
          title: `[${input.difficulty}] Quiz for ${input.subject}`,
        },
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
            question: q.question,
            options: q.options,
            type: q.type,
          };
        }),
      };
    }),
  gradeExam: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        answers: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.id,
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

      // TODO: Check if quiz is already graded
      if (quiz.score > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quiz already graded",
        });
      }

      // TODO: call open ai to grade the quiz
      // const { score, explanation } = await gradeQuiz(
      //   quiz.topic,
      //   quiz.difficulty,
      //   quiz.questions,
      //   input.answers
      // );

      // await ctx.prisma.quiz.update({
      //   where: {
      //     id: input.id,
      //   },
      //   data: {
      //     score,
      //   },
      // });
      // return score;
    }),
});
