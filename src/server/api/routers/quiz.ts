// Import the 'z' object from the 'zod' library
import { z } from "zod";  // Validation library 

// Import the 'createTRPCRouter' and 'protectedProcedure' functions from the '@/server/api/trpc' file
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";  // build typesafe API endpoints 

// Import the 'QuizDifficulty' and 'Topics' enums from the '@prisma/client' library
import { QuizDifficulty, Topics } from "@prisma/client";


// Create a router object for quizzes using the 'createTRPCRouter' function
export const quizRouter = createTRPCRouter({
  // Define a procedure for getting past exams
  getPastExams: protectedProcedure.query(async ({ ctx }) => {
    // Query the database using Prisma to retrieve quizzes associated with the current user ID
    return await ctx.prisma.quiz.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      
    });
  }),

  // Define a procedure for creating a new exam
  createExam: protectedProcedure
    .input(
      // Define a validation schema for the input using the 'z' library
      z.object({
        difficulty: z.nativeEnum(QuizDifficulty), // Validate that 'difficulty' is a valid value from the 'QuizDifficulty' enum
        university: z.string(), // Validate that 'university' is a string
        title: z
          .string()
          .min(1, "Should be more than 1 character long.")
          .max(50), // Validate that 'title' is a string with a length between 1 and 50 characters
        description: z
          .string()
          .min(1, "Should be more than 1 character long.")
          .max(50), // Validate that 'description' is a string with a length between 1 and 50 characters
        topic: z.nativeEnum(Topics), // Validate that 'topic' is a valid value from the 'Topics' enum
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create a new quiz in the database using Prisma
      await ctx.prisma.quiz.create({
        data: {
          difficulty: input.difficulty,
          title: input.title,
          description: input.description,
          topic: input.topic,
          userId: ctx.session.user.id,
        },
      });

    }),

    // Define a procedure for listing the list of past exams to the users
    listExams: protectedProcedure.query(async ({ ctx}) => { 
      try {
        // Query the database using Prisma to retrieve quizzes associated with the current user ID
        const exams =  await ctx.prisma.quiz.findMany({
          where: {
            userId: ctx.session.user.id,
          },
        });
        return exams;
        //catch an error just incase we cannont retrieve user exams
      } catch (error) {
      
        console.error(error);
        throw new Error("There are no past exams");
        
      }     
      
   
 
      

    }),



  // Define a procedure for getting a secret message
  getSecretMessage: protectedProcedure.query(() => {
    // Return a secret message
    return "you can now see this secret message!";
  }),
});


