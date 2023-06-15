// implement a validator function to ensure the selected quiz topic is valid and supported
import { QuestionType, QuizDifficulty, Topics } from "@prisma/client";
import z from "zod";

export const createQuizSchema = z.object({
  difficulty: z.nativeEnum(QuizDifficulty),
  university: z.string().min(1).max(100),
  questions: z.number().int().min(1).max(100),
  options: z
    .array(z.nativeEnum(QuestionType))
    .max(3)
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  notes: z.string().max(1000),
  subject: z.nativeEnum(Topics),
});

export type CreateQuizRequestType = z.infer<typeof createQuizSchema>;
