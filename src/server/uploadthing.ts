/** server/uploadthing.ts */
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { Role, Topics, type Document, Prisma } from "@prisma/client";
import { z } from "zod";
import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import { getServerAuthSession } from "./auth";
import { prisma } from "./db";
import { env } from "@/env.mjs";

const f = createUploadthing();

export const ourFileRouter = {
  uploader: f({
    pdf: {
      maxFileSize: "16MB",
    },
    // text: {
    //   maxFileSize: "4MB",
    // },
  })
    // .input(
    //   z.object({
    //     topic: z.nativeEnum(Topics),
    //     subtopic: z.string(),
    //   })
    // )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res, input }) => {
      // This code runs on your server before upload
      const session = await getServerAuthSession({ req, res });

      // If you throw, the user will not be able to upload
      // if (session?.user.role != Role.ADMIN) throw new Error("Unauthorized");

      return {
        // email: session.user.email as string,
        // topic: input.topic,
        // subtopic: input.subtopic,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file", file);
      const loader = new PDFLoader(file.url);
      let docs = await loader.load();
      const text_splitter = new CharacterTextSplitter({
        chunkSize: 6,
        chunkOverlap: 6,
      });
      docs = await text_splitter.splitDocuments(docs);
      console.log("docs", docs);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
