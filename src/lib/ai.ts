import { QuestionType, Questions } from "@prisma/client";

import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "langchain/tools";
import { SerpAPI, ChainTool } from "langchain/tools";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { LLMChain } from "langchain/chains";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { env } from "@/env.mjs";
import type { CreateQuizRequestType } from "@/server/validators";

const model = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0,
  maxTokens: 1500,
  verbose: true,
});

// const serpapiTool = new SerpAPI(env.SERPAPI_API_KEY, {
//   location: "Austin,Texas,United States",
//   hl: "en",
//   gl: "us",
// });

const client = new PineconeClient();

const quizParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      type: z.nativeEnum(QuestionType).describe("the type of question"),
      question: z.string().min(1).max(1000).describe("the question"),
      options: z
        .array(z.string().min(1).max(500))
        .max(5)
        .optional()
        .describe("the options, if the question type supports it"),
      answer: z.string().min(1).max(500).describe("the correct answer"),
    })
    .array()
);

type QuizParserType = z.infer<typeof quizParser.schema>;

const gradeQuizParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      question: z
        .string()
        .min(1)
        .max(300)
        .describe("the question the student answered"),
      answer: z
        .string()
        .min(1)
        .max(300)
        .describe("the answer the student gave"),
      explanation: z.string().min(1).max(1000).describe("the explanation"),
      correct: z
        .boolean()
        .describe("Whether the question was answered correctly"),
    })
    .array()
);

export type GradeQuizParserType = z.infer<typeof gradeQuizParser.schema>;

type ContextDocument = {
  title: string;
  url: string;
  text: string;
};

export async function genQuiz(
  config: CreateQuizRequestType
): Promise<QuizParserType | undefined> {
  const prompt = `Greetings! As an esteemed SAT Quiz master, your extensive expertise and extensive experience in the field of {subject} make you the perfect candidate for the following task:
    We have an upcoming examination in {subtopic} and need to create a customized quiz that will effectively prepare our students. 
    As you prepare the quiz, kindly adhere to the provided formatting guidelines: {formatInstruction}. 
    The quiz must comprise approximately {questions} thought-provoking questions.
    To ensure the quiz is suitable for students of varying proficiency levels, it should align with a {difficulty} level of complexity. 
    This will guarantee that the quiz is both challenging and engaging, catering to a wide range of abilities.
    To assess students' comprehensive understanding and provide diverse engagement opportunities, the quiz should incorporate a variety of question formats. 
    Here are our supported question formats:
    Multiple Choice Questions (MCQ)
    Short Answer Questions (SA)
    This will encompass a comprehensive assessment of the subject matter, ensuring a well-rounded evaluation.
    While crafting the quiz, strive for a delicate balance between educational value and clarity. 
    The questions should be formulated in a manner that fosters learning, making them accessible and comprehensible to all students. 
    Avoid adding excessive explanations to maintain a concise and focused quiz format.
  `;

  const format = quizParser.getFormatInstructions();

  const fixParser = OutputFixingParser.fromLLM(model, quizParser);

  const template = new PromptTemplate({
    template: prompt,
    inputVariables: ["subject", "subtopic", "questions", "difficulty"],
    partialVariables: { formatInstruction: format },
    outputParser: fixParser,
  });

  const chain = new LLMChain({ llm: model, prompt: template });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const response = await chain.call({
    subject: config.subject,
    subtopic: config.subtopic,
    questions: config.questions,
    difficulty: config.difficulty,
  });

  const end = performance.now();
  console.log(`\nAI took ${Math.fround((end - start) / 1000)}s to respond`);
  console.log(`\nAI response: ${JSON.stringify(response.text, null, 2)}`);

  return response.text as QuizParserType;
}

export async function gradeQuiz(
  subject: string,
  difficulty: string,
  questions: Questions[],
  answers: string[]
): Promise<GradeQuizParserType | undefined> {
  const prompt = `
  Greetings! As a highly esteemed {subject} professor with a wealth of experience in teaching spanning over a decade, you have been entrusted with the significant responsibility of grading a quiz.
  Earlier today, you conducted a quiz for your students, carefully designed to assess their knowledge at a {difficulty} level of difficulty.
  The quiz consisted of the following thought-provoking questions:
  {questions}
  Now, it's time to evaluate your students' responses, which are as follows:
  {answers}
  Your primary objective is to grade the quiz accurately, providing invaluable feedback to help the students grow and improve.
  Please assign a numerical grade to each quiz, using a scale of 1 to 100. Remember, for every incorrect answer, it is crucial to offer a clear and concise explanation. 
  This serves a dual purpose: it clarifies any misunderstandings and encourages students to learn from their mistakes, fostering a mindset of continuous improvement.
  It is essential to maintain objectivity throughout the grading process, focusing solely on the provided data. Refrain from including any extraneous information or personal insights. 
  The grading should be straightforward and unbiased, assessing the students' performance solely in relation to the correct answers.
  As you prepare your results, kindly adhere to the provided formatting guidelines: {formatInstruction}.`;

  const format = gradeQuizParser.getFormatInstructions();

  const template = new PromptTemplate({
    template: prompt,
    inputVariables: ["subject", "difficulty", "questions", "answers"],
    partialVariables: { formatInstruction: format },
    outputParser: gradeQuizParser,
  });

  const chain = new LLMChain({ llm: model, prompt: template });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const _questions = questions.map((q) => q.question).join("\n");

  const response = await chain.call({
    subject,
    difficulty,
    questions: _questions,
    answers: answers.join("\n"),
  });

  const end = performance.now();
  console.log(`\nAI took ${Math.fround((end - start) / 1000)}s to respond`);
  console.log(`\nAI response: ${JSON.stringify(response.text, null, 2)}`);

  return response.text as GradeQuizParserType;
}
