import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { Role, DocumentType, UploadStatus } from "@prisma/client";

import { getServerAuthSession } from "./auth";
import { prisma } from "./db";
import { parseDocument } from "@/lib/ai/vector-store";
import { uploadDocumentSchema } from "./schemas";

import { UTApi } from "uploadthing/server";


const f = createUploadthing();

export const ourFileRouter = {
  documents: f({
    pdf: {
      maxFileSize: "16MB",
    },
  })
    .input(uploadDocumentSchema)
    .middleware(async ({ req, res, input }) => {
      const session = await getServerAuthSession({ req, res });

      if (!session || session?.user.role != Role.ADMIN)
        throw new Error("Unauthorized");

      return {
        topic: input.topic,
        subtopic: input.subtopic,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const doc = await prisma.document.create({
        data: {
          name: file.name,
          url: file.url,
          key: file.key,
          topic: metadata.topic,
          subtopic: metadata.subtopic,
          type: DocumentType.PDF,
          status: UploadStatus.UPLOADED,
        },
      });

      await parseDocument({
        topic: doc.topic,
        subtopic: doc.subtopic || "",
        id: doc.id,
        url: doc.url,
      });

      return {
        id: doc.id,
        name: doc.name,
        url: doc.url,
      }
    }),
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;
