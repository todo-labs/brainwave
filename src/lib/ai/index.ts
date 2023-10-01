import { env } from "@/env.mjs";
import { OpenAI } from "langchain";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { OpenAIModerationChain } from "langchain/chains";
import { z } from "zod";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

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

export const chat = new ChatOpenAI({ 
  openAIApiKey: env.OPEN_API_KEY,
  verbose: env.NODE_ENV != "production",
  temperature: 0 
});


export async function callOpenAi<T>(
  prompt: string,
  parser?: StructuredOutputParser<z.ZodSchema<T>>
): Promise<T | string | undefined> {
  const text = await isToxic(prompt);
  if (!text) return;
  console.log("Making request to OpenAI API with prompt: \n\n", text);
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

export async function isToxic(text: string): Promise<string | undefined> {
  try {
    console.log("Checking if prompt violates our community guidelines...");
    const moderation = new OpenAIModerationChain({
      throwError: true,
      openAIApiKey: env.OPEN_API_KEY,
    });
    const { output } = await moderation.call({
      input: text,
    });
    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
