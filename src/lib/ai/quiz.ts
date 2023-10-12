import { QuestionType, Questions, QuizDifficulty } from "@prisma/client";
import { z } from "zod";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import type { CreateQuizRequestType } from "@/server/schemas";
import PromptBuilder from "./prompt";
import { callOpenAi } from ".";
import { Languages } from "types";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { env } from "@/env.mjs";
import { getPineConeClient } from "../pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

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

const sentimentParser = StructuredOutputParser.fromZodSchema(
  z.object({
    approved: z
      .boolean()
      .describe(
        "Whether or not this review is appropriate for the given content"
      ),
    suggestion: z
      .string()
      .describe(
        "Why this comment was not approved, if approved return an empty string"
      ),
  })
);

type SentimentParserResponseType = z.infer<typeof sentimentParser.schema>;
type QuizResponseType = z.infer<typeof quizParser.schema>;
type GradeQuizResponseType = z.infer<typeof gradeQuizParser.schema>;

// ------------------------------------ [Functions] ------------------------------------

export async function genQuiz(
  config: CreateQuizRequestType & { lang: Languages }
): Promise<QuizResponseType | undefined> {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPEN_API_KEY,
    });

    const pineconeClient = await getPineConeClient();
    const pineconeIndex = pineconeClient.Index(config.subject);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: "SAT_PRACTICE_EXAMS",
    });

    const results = await vectorStore.similaritySearch(
      `SUBJECT: ${config.subtopic}, DIFFICULTY: ${config.difficulty} SUBTOPIC: ${config.subtopic}`,
      4
    );

    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions(
        "Generate a SAT Practice Exam with {questions} questions."
      )
      .setRelevance(
        "The exam should focus on the subtopic: [{subtopic}] as it pertains to your discipline.",
        "Here are some user notes: {notes}"
      )
      .setRelevance(results.map((r) => r.pageContent).join("\n\n"))
      .setConstraints(
        "Here are our supported question formats:",
        "Multiple Choice Questions (MCQ), Short Answer Questions (SA).",
        "And should have a {difficulty} difficulty level"
      )
      .setPersonalization({ language: config.lang })
      .setRequirements();

    const format = quizParser.getFormatInstructions();

    const template = prompt.build();

    const promptTemplate = new PromptTemplate({
      template,
      inputVariables: [
        "subject",
        "questions",
        "subtopic",
        "notes",
        "difficulty",
      ],
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
  data: Questions[],
  lang: Languages
): Promise<GradeQuizResponseType | undefined> {
  try {
    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions(
        "Grade the following quiz. Determine whether the student got each question correct."
      )
      .setPersonalization({ language: lang })
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
    subtopic: string;
    difficulty: QuizDifficulty;
    score: number;
  },
  name: string,
  lang: Languages
): Promise<string | undefined> {
  try {
    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions(
        "Write an informative breakdown of the students performance on their recent exam."
      )
      .setRelevance(
        "The student recently took an exam on the topic of {subtopic} with a {difficulty} difficulty level.",
        "The student scored {score}% on the exam.",
        "Here were your student's answers: ",
        "{results}"
      )
      .setConstraints(
        "The review notes MUST be written in markdown format including latex math expressions if applicable."
      )
      .setRequirements("Should contain no more than 500 words.")
      .setPersonalization({ name, teacher: "Brainwave", language: lang });

    const promptTemplate = new PromptTemplate({
      template: prompt.build(),
      inputVariables: ["subject", "subtopic", "difficulty", "score", "results"],
    });

    const input = await promptTemplate.format({
      subject: data.subject,
      subtopic: data.subtopic,
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

export async function reviewComment(
  comment: string,
  content: {
    subject: string;
    subtopic: string;
  }
): Promise<SentimentParserResponseType> {
  try {
    const prompt = new PromptBuilder()
      .setContext()
      .setInstructions("Review the following comment: {comment}.")
      .setRelevance(
        "The comment is in response to the following content: {content}"
      )
      .setRequirements();

    const formatInstruction = sentimentParser.getFormatInstructions();

    const promptTemplate = new PromptTemplate({
      template: prompt.build(),
      inputVariables: ["subject", "comment", "content"],
      partialVariables: { formatInstruction },
    });

    const input = await promptTemplate.format({
      comment,
      content: JSON.stringify(content),
      subject: content.subject,
    });

    const result = await callOpenAi<SentimentParserResponseType>(
      input,
      sentimentParser
    );

    return result as SentimentParserResponseType;
  } catch (e) {
    console.error(e);
    return { approved: false, suggestion: "Failed to parse comment" };
  }
}
