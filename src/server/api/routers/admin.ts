import * as z from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  totalUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count();
  }),
  allQuizzes: adminProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany();
    return quizzes || [];
  }),
  removeUser: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({
        where: { id: input },
      });
    }),
  allUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: {
        quizzes: true,
      },
    });
  }),
  addCredits: adminProcedure
    .input(z.object({ id: z.string().cuid(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: { credits: { increment: input.credits } },
      });
    }),
});
