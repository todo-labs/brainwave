import { Pinecone } from "@pinecone-database/pinecone";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
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

export const getPineconeIndex = () => {
  const pineconeClient = getPineConeClient();
  return pineconeClient.Index("test");
}

type Args = {
  topic: Topics;
  subtopic: string;
  url: string;
  id: string;
};

export async function parseDocument(args: Args) {
  try {
    const response = await fetch(args.url);
    const blob = await response.blob();
    const loader = new WebPDFLoader(blob);
    const pageLevelDocs = await loader.load();

    pageLevelDocs.forEach((doc) => {
      doc.metadata = {
        topic: args.topic,
        ...(args.subtopic && { subtopic: args.subtopic })
      };
    });

    const pineconeIndex = getPineconeIndex();
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPEN_API_KEY,
      verbose: env.NODE_ENV !== "production",
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
    });

    await prisma.document.update({
      data: { status: UploadStatus.PARSED },
      where: { id: args.id },
    });
  } catch (err) {
    console.error("An error occurred:", err);

    await prisma.document.update({
      data: { status: UploadStatus.REJECTED },
      where: { id: args.id },
    });

    console.log("Document status updated to REJECTED");
  }
}
