import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { getServerAuthSession } from "./auth";
import { prisma } from "./db";
import { DocumentType, Topics, UploadStatus } from "@prisma/client";
import { parseDocument } from "@/lib/pinecone";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  documents: f({ pdf: { maxFileSize: "1GB" } })
    .input(z.object({ topic: z.nativeEnum(Topics) }))
    .middleware(async ({ req, res, input }) => {
      const ctx = await getServerAuthSession({ req, res });
      if (!ctx) throw new Error("Unauthorized");
      return input;
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await prisma.document.create({
        data: {
          name: file.name,
          url: file.url,
          topic: metadata.topic as Topics,
          type: DocumentType.PDF,
          status: UploadStatus.UPLOADED,
          key: file.key,
        },
      });

      await parseDocument({
        topic: metadata.topic,
        key: file.key,
        url: file.url,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
