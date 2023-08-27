import { QuizDifficulty, Topics } from "@prisma/client";
import z from "zod";

export const createQuizSchema = z.object({
  difficulty: z.nativeEnum(QuizDifficulty),
  subtopic: z.string().min(1).max(100),
  questions: z.number().int().min(1).max(100),
  notes: z.string().max(1000),
  subject: z.nativeEnum(Topics),
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export const gradeQuizSchema = z.object({
  quizId: z.string().cuid(),
  answers: z.array(z.string()),
});

export type CreateQuizRequestType = z.infer<typeof createQuizSchema>;
export type ProfileRequestType = z.infer<typeof profileSchema>;
export type GradeQuizRequestType = z.infer<typeof gradeQuizSchema>;
