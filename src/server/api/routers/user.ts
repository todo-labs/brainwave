import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { profileSchema } from "@/server/schemas";
import { cleanEnum } from "@/lib/utils";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user.email as string,
      },
      select: {
        name: true,
        credits: true,
        lang: true,
      },
    });
  }),
  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.prisma.user.update({
          where: {
            email: ctx.session?.user.email as string,
          },
          data: {
            name: input.name,
            lang: input.language || "en",
          },
        });

        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update profile",
        });
      }
    }),
  pointsBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany({
      where: {
        user: {
          email: ctx.session?.user.email as string,
        },
      },
    });

    const totalScore = quizzes.reduce((acc, quiz) => {
      return acc + quiz.score;
    }, 0);

    const uniqueTopics = quizzes.reduce((acc, quiz) => {
      if (!acc.includes(quiz.topic)) {
        acc.push(quiz.topic);
      }
      return acc;
    }, [] as string[]);

    const averageScore = totalScore / quizzes.length;

    return {
      totalScore: Math.floor(totalScore) || 0,
      averageScore: Math.floor(averageScore) || 0,
      uniqueTopics: uniqueTopics.length || 0,
      totalQuizzes: quizzes.length || 0,
    };
  }),
  quizBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session.user.email as string,
      },
      select: {
        quizzes: {
          select: {
            topic: true,
          },
        },
      },
    });

    const results = user?.quizzes.reduce<{ [key: string]: number }>(
      (acc, quiz) => {
        const topic = cleanEnum(quiz.topic);
        if (acc[topic]) acc[topic]++;
        else acc[topic] = 1;
        return acc;
      },
      {}
    );

    return Object.entries(results ?? {}).map(([label, amount]) => ({
      label,
      amount: amount ?? 0,
    }));
  }),
  rank: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        name: true,
        quizzes: {
          where: {
            score: {
              gt: 0,
            },
          },
          select: {
            score: true,
          },
        },
      },
    });

    const usersWithScore = users.map((user) => ({
      name: user.name,
      score: user.quizzes.reduce((acc, quiz) => {
        return acc + quiz.score;
      }, 0),
    }));

    const sortedUsers = usersWithScore.sort((a, b) => b.score - a.score);

    const rank =
      sortedUsers.findIndex((user) => user.name === ctx.session?.user.name) + 1;

    return rank;
  }),
});
