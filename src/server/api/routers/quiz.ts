import { z } from "zod";



import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { QuizDifficulty, Topics } from "@prisma/client";

export const quizRouter = createTRPCRouter({
  getPastExams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.quiz.findMany({
        where: {
            userId:ctx.session.user.id
        }
        
    })
  }),

  createExam: protectedProcedure.input(
    z.object({
        difficulty: z.nativeEnum(QuizDifficulty),
        university: z.string(),
        title: z.string().min(1, "Should be more than 1 character long.").max(50),
        description: z.string().min(1, "Should be more than 1 character long.").max(50),
        topic: z.nativeEnum(Topics)
        

      })
  ).mutation(async ({ input,  ctx }) => {
     await ctx.prisma.quiz.create({
        data: { 
            difficulty: input.difficulty,
            title: input.title,
            description: input.description,
            topic: input.topic,
            userId: ctx.session.user.id
        }
        
    })
  }),
  

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
