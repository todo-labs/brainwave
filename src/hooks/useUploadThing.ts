import { OurFileRouter } from "@/server/uploadthing";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
