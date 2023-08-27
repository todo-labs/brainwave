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

const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
  new OpenAIEmbeddings({
    openAIApiKey: env.OPEN_API_KEY,
    modelName: "ada",
  }),
  {
    prisma: Prisma,
    tableName: "Document",
    vectorColumnName: "vector",
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  }
);

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
      // await vectorStore.addModels(
      //   await prisma.$transaction(
      //     docs.map((content) => db.document.create({ data: { content } }))
      //   )
      // );
      // await prisma.document.create({
      //   data: {
      //     name: file.name,
      //     url: file.url,
      //     topic: metadata.topic,
      //     subtopic: metadata.subtopic,
      //     email: metadata.email,
      //     // type: file.,
      //   },
      // });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
