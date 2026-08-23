import { PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { Topics, UploadStatus } from "@prisma/client";
import { cleanEnum } from "./utils";

export const getPineConeClient = async () => {
  const client = new PineconeClient();
  await client.init({
    apiKey: env.PINECONE_API_KEY,
    environment: "us-west4-gcp-free",
  });
  return client;
};

type Args = {
  topic: Topics;
  url: string;
  key: string;
};

export async function parseDocument(args: Args) {
  try {
    const response = await fetch(args.url);
    const blob = await response.blob();
    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();

    const pineconeClient = await getPineConeClient();

    await pineconeClient.createIndex({
      createRequest: {
        name: args.topic.toLocaleLowerCase(),
        // suppressConflicts: true,
        metric: "cosine",
        dimension: 1536,
        // waitUntilReady: true,
      },
    });

    const pineconeIndex = pineconeClient.Index(args.topic);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPEN_API_KEY,
      verbose: env.NODE_ENV !== "production",
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
    });

    await prisma.document.update({
      data: { status: UploadStatus.PARSED },
      where: { key: args.key },
    });

    console.log(
      "DONE DONE DONE DONE DONE DONE DONE DONE DONEK DONE DONE DONEO DOND DONE DONE DONE DONE DONE DONE"
    );
  } catch (err) {
    await prisma.document.update({
      data: { status: UploadStatus.REJECTED },
      where: { key: args.key },
    });
  }
}
