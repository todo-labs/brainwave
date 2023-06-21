/** server/uploadthing.ts */
import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { prisma } from "./db";

const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    pdf: {
      maxFileSize: "16MB",
    },
    text: {
      maxFileSize: "4MB",
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(({ req, res }) => {
      // This code runs on your server before upload
      const user = auth(req, res);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        topic: req.body.topic,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      await prisma.documents.create({
        data: {
          name: file.name,
          url: file.url,
          // userId: metadata.userId,
        },
      });
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
