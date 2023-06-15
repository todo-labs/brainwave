import { env } from "@/env.mjs";
import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { QuestionType } from "@prisma/client";

import type { CreateQuizRequestType } from "@/server/validators";

const model = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0,
  maxTokens: 1500,
  verbose: true,
});

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

type GradeQuizParserType = z.infer<typeof gradeQuizParser.schema>;

async function callOpenAi<T>(
  prompt: string,
  parser?: StructuredOutputParser<z.ZodSchema<T>>
): Promise<T | string | undefined> {
  console.log("Making request to OpenAI API with prompt: \n\n", prompt);
  console.log(`\nAI is thinking...`);
  const start = performance.now();
  const response = await model.call(prompt);
  try {
    const data = parser ? await parser.parse(response) : response;
    const end = performance.now();
    const time = Math.round((end - start) / 1000);
    console.log(`AI took ${time}s to generate quiz`);
    console.log(
      "Response from OpenAI: \n\n",
      JSON.stringify(response, null, 2)
    );
    return data;
  } catch (error) {
    console.error("Failed to parse bad output: ", error);
    if (!parser) return response;
    const fixParser = OutputFixingParser.fromLLM(model, parser);
    const output = await fixParser.parse(response);
    console.log("Fixed output: ", output);
    return output;
  }
}

export async function genQuiz(
  config: CreateQuizRequestType
): Promise<QuizParserType | undefined> {
  const prompt = `Greetings! As a distinguished professor at {university} with more than a dozen years of experience under your belt in the field of {subject}, you are uniquely qualified for this task.
  We have an upcoming examination in {subject} that necessitates the creation of a tailored quiz to help prepare the students. 
  The quiz should consist of approximately {questions} questions.
  The complexity of the quiz should align with a {difficulty} level of difficulty. 
  This will ensure the quiz is both challenging and engaging for students at various levels of proficiency.
  The questions in the quiz should come in an array of formats, to both test the students' comprehensive understanding of the subject and to provide varied methods of engagement. 
  Here are some possible question types:
  MCQ: Multiple Choice Questions
  TF: True or False Questions
  SA: Short Answer Questions
  MT: Matching Questions
  Please abide by these formatting guidelines as you prepare the quiz: {formatInstruction}.
  In particular, the quiz should feature questions from the following categories: {options}.
  As you craft the quiz, please strive to strike a balance between educational and understandable. 
  The questions should be framed in a way that encourages learning, while still being accessible and clear to the students.
  Please don't add any explanation.
  `;

  const format = quizParser.getFormatInstructions();

  const fixParser = OutputFixingParser.fromLLM(model, quizParser);

  const template = new PromptTemplate({
    template: prompt,
    inputVariables: [
      "university",
      "subject",
      "questions",
      "difficulty",
      "options",
    ],
    partialVariables: { formatInstruction: format },
    outputParser: fixParser,
  });

  const input = await template.format(config);

  const result = await callOpenAi<QuizParserType>(input, quizParser);
  return result as QuizParserType;
}

export async function gradeQuiz(
  subject: string,
  difficulty: string,
  questions: QuizParserType,
  answers: string[]
): Promise<GradeQuizParserType | undefined> {
  const prompt = `Greetings! As an accomplished {subject} professor with over a decade of teaching experience, you've been tasked with the job of grading a quiz.
    Earlier in the day, you administered a quiz to your students, gauged at a {difficulty} level of difficulty.
    You provided the questions, along with the correct answers as follows:
    {questions}
    You've since received the students' responses:
    {answers}
    Your task now is to grade the quiz, providing valuable feedback to the students. 
    Please grade the quiz on a scale of 100.
    For each incorrect answer, it's crucial that you provide a clear explanation. 
    The purpose of this is twofold: to clarify any misunderstandings and to promote learning from the student's errors. 
    Without these explanations, the students will not have the opportunity to learn from their mistakes and make improvements for the future.
    Ensure you provide your response according to these guidelines: {formatInstruction}.
    In the grading process, we are focusing solely on the data. 
    Please avoid including any extraneous information or personal insights. 
    The grading should be objective and straightforward, solely focused on the student's performance in relation to the correct answers.`;

  const format = quizParser.getFormatInstructions();

  const template = new PromptTemplate({
    template: prompt,
    inputVariables: ["subject", "difficulty", "questions"],
    partialVariables: { formatInstruction: format },
  });

  const questionsString = questions.map((question) => {
    return `Q:${question.question}\nA:${question.answer}\n`;
  });

  const input = await template.format({
    subject,
    difficulty,
    questions: questionsString,
    answers,
  });

  const result = await callOpenAi<GradeQuizParserType>(input, gradeQuizParser);
  return result as GradeQuizParserType;
}
