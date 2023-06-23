import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import * as z from "zod";

export const adminRouter = createTRPCRouter({
  totalUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count();
  }),
  allQuizzes: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany();
    return quizzes || [];
  }),
  removeUser: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({
        where: { id: input },
      });
    }),
  allUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  addCredits: protectedProcedure
    .input(z.object({ id: z.string().cuid(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: { credits: { increment: input.credits } },
      });
    }),
});
