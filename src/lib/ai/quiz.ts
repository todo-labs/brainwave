import { QuestionType, Questions, QuizDifficulty } from "@prisma/client";
import { z } from "zod";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import type { CreateQuizRequestType } from "@/server/schemas";
import PromptBuilder from "./prompt";
import { callOpenAi } from ".";

// ------------------------------------ [Schemas] ------------------------------------
const quizParser = StructuredOutputParser.fromZodSchema(
  z.array(
    z.object({
      type: z.nativeEnum(QuestionType).describe("the type of question"),
      question: z.string().min(1).max(1000).describe("the question"),
      options: z
        .array(z.string().min(1).max(500))
        .max(5)
        .optional()
        .describe("the options, if the question type supports it"),
      answer: z.string().min(1).max(500).describe("the correct answer"),
    })
  )
);

const gradeQuizParser = StructuredOutputParser.fromZodSchema(
  z.array(
    z.object({
      question: z.string().describe("the question"),
      answer: z.string().describe("the answer to the current question"),
      studentAnswer: z.string().describe("the answer to the current question"),
      type: z.nativeEnum(QuestionType),
      correct: z
        .boolean()
        .describe("whether the student got the answer correct"),
    })
  )
);

type QuizResponseType = z.infer<typeof quizParser.schema>;
type GradeQuizResponseType = z.infer<typeof gradeQuizParser.schema>;

type ContextDocument = {
  title: string;
  url: string;
  text: string;
};

// ------------------------------------ [Functions] ------------------------------------

export async function genQuiz(
  config: CreateQuizRequestType
): Promise<QuizResponseType | undefined> {
  try {
    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions(
        "Generate a SAT Practice Exam with {questions} questions."
      )
      .setRelevance(
        "The exam should focus on the subtopic: [{subtopic}] as it pertains to your discipline."
      )
      .setConstraints(
        "Here are our supported question formats:",
        "Multiple Choice Questions (MCQ), Short Answer Questions (SA).",
        "And should have a {difficulty} difficulty level"
      )
      .setRequirements();

    const format = quizParser.getFormatInstructions();

    const promptTemplate = new PromptTemplate({
      template: prompt.build(),
      inputVariables: ["subject", "questions", "subtopic", "difficulty"],
      partialVariables: { formatInstruction: format },
    });

    const input = await promptTemplate.format(config);

    const result = await callOpenAi<QuizResponseType>(input, quizParser);

    return result as QuizResponseType;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function gradeQuiz(
  subject: string,
  difficulty: QuizDifficulty,
  data: Questions[]
): Promise<GradeQuizResponseType | undefined> {
  try {
    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions(
        "Grade the following quiz. Determine whether the student got each question correct."
      )
      .setRelevance(
        "The student has just completed a quiz with a {difficulty} difficulty rating. Here are their results: {results}"
      )
      .setRequirements();

    const formatInstruction = gradeQuizParser.getFormatInstructions();

    const promptTemplate = new PromptTemplate({
      template: prompt.build(),
      inputVariables: ["subject", "difficulty", "results"],
      partialVariables: { formatInstruction },
      outputParser: gradeQuizParser,
    });

    const results = data
      .map(({ label = "NA", type = "NA", answer = "NA", solution = "NA" }) => {
        return [
          "--- BEGIN ----",
          `Question: ${label}`,
          `Type: ${type}`,
          `Correct Answer: ${solution}`,
          `Student Answer: ${answer}`,
          "--- END ----",
        ].join("\n");
      })
      .join("\n");

    const input = await promptTemplate.format({
      subject,
      difficulty,
      results,
    });

    const result = await callOpenAi<GradeQuizResponseType>(
      input,
      gradeQuizParser
    );

    return result as GradeQuizResponseType;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function genReviewNotes(
  results: GradeQuizResponseType,
  data: {
    subject: string;
    difficulty: QuizDifficulty;
    score: number;
  },
  name: string
): Promise<string | undefined> {
  try {
    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions(
        "Write an informative breakdown of the students performance on their recent exam."
      )
      .setRelevance(
        "The exam was {difficulty} difficulty.",
        "The student scored {score}% on the exam.",
        "Here were your students answers: ",
        "{results}"
      )
      .setConstraints(
        "The review notes MUST be written in markdown format including latex math expressions and code examples if applicable."
      )
      .setRequirements("Should contain no more than 500 words.")
      .setPersonalization({ name })
      .build();

    const promptTemplate = new PromptTemplate({
      template: prompt,
      inputVariables: ["subject", "difficulty", "score", "results"],
    });

    const input = await promptTemplate.format({
      subject: data.subject,
      results: JSON.stringify(results),
      difficulty: data.difficulty,
      score: data.score,
    });

    const response = await callOpenAi<string>(input);

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
