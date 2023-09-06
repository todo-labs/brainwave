import { env } from "@/env.mjs";
import { OpenAI } from "langchain";
import { OutputFixingParser, StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

export const gpt4 = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0.4,
  modelName: "gpt-4",
  maxRetries: 2,
  maxTokens: 2500,
  verbose: env.NODE_ENV != "production",
});

export const gpt3 = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  maxRetries: 2,
  maxTokens: 2500,
  verbose: env.NODE_ENV != "production",
});

export async function callOpenAi<T>(
  prompt: string,
  parser?: StructuredOutputParser<z.ZodSchema<T>>
): Promise<T | string | undefined> {
  console.log("Making request to OpenAI API with prompt: \n\n", prompt);
  console.log(`\nAI is thinking...`);
  const start = performance.now();
  const response = await gpt4.call(prompt);
  try {
    const data = parser ? await parser.parse(response) : response;
    const end = performance.now();
    const time = Math.round((end - start) / 1000);
    console.log(`AI took ${time}s seconds to generate quiz.`);
    console.log("Response from OpenAI: \n\n", response);
    return data;
  } catch (error) {
    console.error("Failed to parse bad output: ", error);
    if (!parser) return response;
    const fixParser = OutputFixingParser.fromLLM(gpt3, parser);
    const output = await fixParser.parse(response);
    console.log("Fixed output: ", !!output);
    return output;
  }
}
