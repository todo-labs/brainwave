import { env } from "@/env.mjs";
import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { QuestionType, Questions } from "@prisma/client";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "langchain/tools";
import { SerpAPI, ChainTool } from "langchain/tools";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { LLMChain } from "langchain/chains";
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

// const vectorStore = await HNSWLib.fromDocuments([], new OpenAIEmbeddings());

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
  z.object({
    score: z.number().min(0).max(100).describe("the score of the quiz"),
    explanation: z.string().min(1).max(1000).describe("the explanation"),
  })
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

  console.log({
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
  const prompt = `Greetings! As an accomplished {subject} professor with over a decade of teaching experience, you've been tasked with the job of grading a quiz.
    Earlier in the day, you administered a quiz to your students, gauged at a {difficulty} level of difficulty.
    Ensure you provide your response according to these guidelines: {formatInstruction}.
    You provided the questions, along with the correct answers as follows:
    {questions}
    You've since received the students' responses:
    {answers}
    Your task now is to grade the quiz, providing valuable feedback to the students.
    Please grade the quiz on a scale of 1 to 100.
    For each incorrect answer, it's crucial that you provide a clear explanation.
    The purpose of this is twofold: to clarify any misunderstandings and to promote learning from the student's errors.
    Without these explanations, the students will not have the opportunity to learn from their mistakes and make improvements for the future.
    In the grading process, we are focusing solely on the data.
    Please avoid including any extraneous information or personal insights.
    The grading should be objective and straightforward, solely focused on the student's performance in relation to the correct answers.`;

  const format = gradeQuizParser.getFormatInstructions();

  const template = new PromptTemplate({
    template: prompt,
    inputVariables: ["subject", "difficulty", "questions", "answers"],
    partialVariables: { formatInstruction: format },
    outputParser: gradeQuizParser,
  });

  const questionsString = questions.map((question) => {
    return `Q:${question.question}\nA:${question.answer}\n`;
  });

  const chain = new LLMChain({ llm: model, prompt: template });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const response = await chain.call({
    subject,
    difficulty,
    questions: questionsString.join("\n"),
    answers: answers.join("\n"),
  });

  const end = performance.now();
  console.log(`\nAI took ${Math.fround((end - start) / 1000)}s to respond`);
  console.log(`\nAI response: ${JSON.stringify(response.text, null, 2)}`);

  return response.text as GradeQuizParserType;
}
