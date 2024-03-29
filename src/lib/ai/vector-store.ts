import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { type Topics, UploadStatus } from "@prisma/client";

export const getPineConeClient = () => {
  return new Pinecone({
    apiKey: env.PINECONE_API_KEY as string,
  });
};

type Args = {
  topic: Topics;
  subtopic: string;
  url: string;
  id: string;
};

export async function parseDocument(args: Args) {
  try {
    console.log("Fetching document from URL:", args.url);
    const response = await fetch(args.url);
    console.log("Document fetched successfully");

    const blob = await response.blob();
    console.log("Document blob created");

    const loader = new PDFLoader(blob);
    console.log("PDFLoader initialized");

    const pageLevelDocs = await loader.loadAndSplit();
    console.log("PDF loaded and split into pages");

    pageLevelDocs.forEach((doc) => {
      doc.metadata = {
        topic: args.topic,
        subtopic: args.subtopic,
      };
    });

    console.log("Metadata added to each page");

    const pineconeClient = getPineConeClient();
    console.log("Pinecone client created");

    await pineconeClient.createIndex({
      name: args.topic.toString(),
      suppressConflicts: true,
      metric: "cosine",
      dimension: 1536,
      waitUntilReady: true,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-west-2",
        },
      },
    });

    console.log("Pinecone index created");

    const pineconeIndex = pineconeClient.Index(args.topic);
    console.log("Pinecone index retrieved");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPEN_API_KEY,
      verbose: env.NODE_ENV !== "production",
    });

    console.log("OpenAI embeddings initialized");

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
    });

    console.log("Documents stored in Pinecone");

    await prisma.document.update({
      data: { status: UploadStatus.PARSED },
      where: { id: args.id },
    });

    console.log("Document status updated to PARSED");

  } catch (err) {
    console.error("An error occurred:", err);

    await prisma.document.update({
      data: { status: UploadStatus.REJECTED },
      where: { id: args.id },
    });

    console.log("Document status updated to REJECTED");
  }
}
