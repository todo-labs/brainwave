import { QuizDifficulty, ReportType, Topics } from "@prisma/client";
import { languages } from "types";
import z from "zod";

export const createQuizSchema = z.object({
  difficulty: z.nativeEnum(QuizDifficulty),
  subtopic: z.string().min(1).max(100),
  questions: z.number().int().min(1).max(100),
  notes: z.string().max(1000).optional(),
  subject: z.nativeEnum(Topics),
});

export const paginationSchema = z.object({
  pageIndex: z.number().default(1),
  pageSize: z.number().min(1).default(10),
  sortAsc: z.boolean().optional().default(false),
  query: z.string().optional(),
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
  language: z.enum(languages).optional(),
});

export const gradeQuizSchema = z.object({
  quizId: z.string().cuid(),
  answers: z.array(z.string()),
});

export const reportSchema = z.object({
  pageUrl: z.string(),
  message: z.string().min(10).max(5000),
  userAgent: z.string(),
  issueType: z.nativeEnum(ReportType).optional(),
  meta: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const modifySubtopicSchema = z.object({
  topic: z.nativeEnum(Topics).nullable(),
  subtopic: z.string().min(1).max(100),
});

export const uploadDocumentSchema = z.object({
  topic: z.nativeEnum(Topics),
  subtopic: z.string().min(1).max(100).optional(),
});

export type CreateQuizRequestType = z.infer<typeof createQuizSchema>;
export type ProfileRequestType = z.infer<typeof profileSchema>;
export type GradeQuizRequestType = z.infer<typeof gradeQuizSchema>;
export type PaginationRequestType = z.infer<typeof paginationSchema>;
export type ReportRequestType = z.infer<typeof reportSchema>;
export type ModifySubtopicRequestType = z.infer<typeof modifySubtopicSchema>;
export type UploadDocumentRequestType = z.infer<typeof uploadDocumentSchema>;
