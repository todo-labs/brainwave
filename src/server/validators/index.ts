// implement a validator function to ensure the selected quiz topic is valid and supported
import { QuestionType, QuizDifficulty, Topics } from "@prisma/client";
import z from "zod";

export const createQuizSchema = z.object({
  difficulty: z.nativeEnum(QuizDifficulty),
  subtopic: z.string().min(1).max(100),
  questions: z.number().int().min(1).max(100),
  options: z
    .array(z.enum([QuestionType.MCQ, QuestionType.SA]))
    .max(3)
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    })
    .optional(),
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
  profilePicture: z
    .string()
    .url({
      message: "Profile picture must be a valid URL.",
    })
    .optional(),
});

export type CreateQuizRequestType = z.infer<typeof createQuizSchema>;
export type ProfileRequestType = z.infer<typeof profileSchema>;
