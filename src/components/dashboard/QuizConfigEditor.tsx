import React from "react";
import { Topics } from "@prisma/client";
// import { UploadFileView, UploadProvider, UploadZone } from "@uploadthing/react";
import { UploadButton, UploadDropzone } from "@uploadthing/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import type { OurFileRouter } from "@/server/uploadthing";
import { cleanEnum, cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import "@uploadthing/react/styles.css";

export const QuizConfigEditor: React.FC = () => {
  const [selected, setSelected] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = React.useState<Topics>();

  const { toast } = useToast();

  const EditDialog = () => {
    return (
      <Dialog open={selected} onOpenChange={(open) => setSelected(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {cleanEnum(selectedTopic?.toLocaleLowerCase() as string)}{" "}
              Documents
            </DialogTitle>
            <DialogDescription>
              Here is where you can upload document that will be used to provide
              context for the quiz. Our system will parse the documents and
              generate questions based on the content.
            </DialogDescription>
            <div className="flex flex-col items-center justify-center gap-4">
              <UploadDropzone<OurFileRouter>
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  console.log("Files: ", res);
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sub Topics</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className=" flex flex-col ">
        <section className="flex flex-wrap">
          {Object.keys(Topics).map((topic, index) => {
            return (
              <Card
                key={index}
                className={cn(
                  "mr-3 flex max-w-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 text-center hover:border-4 hover:border-primary hover:text-white xl:m-3",
                  {
                    "border-4 border-primary bg-primary shadow-lg":
                      selectedTopic === topic,
                  }
                )}
                onClick={() => {
                  setSelected(!selected);
                  setSelectedTopic(topic as Topics);
                }}
              >
                <CardDescription>
                  <h1
                    className={cn("font-medium", {
                      "text-white": selected,
                    })}
                  >
                    {cleanEnum(topic)}
                  </h1>
                </CardDescription>
              </Card>
            );
          })}
        </section>
        <EditDialog />
      </CardContent>
    </Card>
  );
};

export default QuizConfigEditor;
