"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { FileSpreadsheet, UploadCloudIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";
import { useUploadThing } from "@/hooks/useUploadThing";
import { Topics } from "@prisma/client";

const AddDocumentsModal = ({ topic }: { topic: Topics | null }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const utils = api.useContext();
  const { startUpload } = useUploadThing("documents");

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const { mutate: startPolling } = api.meta.getFile.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "File uploaded successfully",
      });
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }}
    >
      <DialogTrigger className="float-right">
        {!!topic && (
          <Button variant="outline">
            <UploadCloudIcon className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="cursor-pointer">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            Upload Documents
          </DialogTitle>
          <DialogDescription className="flex justify-between">
            <p>
              Topic:{" "}
              <span className="font-bold text-primary">
                {!!topic && cleanEnum(topic)}
              </span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <Dropzone
          multiple={false}
          onDrop={async (acceptedFile) => {
            setIsUploading(true);

            const progressInterval = startSimulatedProgress();

            const res = await startUpload(acceptedFile, {
              topic: topic as Topics,
            });

            if (!res) {
              return toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
              });
            }

            const [fileResponse] = res;

            const key = fileResponse?.key;

            if (!key) {
              return toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
              });
            }

            clearInterval(progressInterval);
            setUploadProgress(100);

            startPolling({ key });
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div
              {...getRootProps()}
              className="m-4 h-64 rounded-lg border border-dashed border-gray-600"
            >
              <div className="flex h-full w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                    <p className="mb-2 text-sm text-zinc-700">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">PDF (up to 1GB)</p>
                  </div>

                  {acceptedFiles && acceptedFiles[0] ? (
                    <div className="flex max-w-xs items-center divide-x divide-muted overflow-hidden rounded-md outline outline-[1px] outline-muted">
                      <div className="grid h-full place-items-center px-3 py-2">
                        <File className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="h-full truncate px-3 py-2 text-sm">
                        {acceptedFiles[0].name}
                      </div>
                    </div>
                  ) : null}

                  {isUploading ? (
                    <div className="mx-auto mt-4 w-full max-w-xs">
                      <Progress
                        value={uploadProgress}
                        className="h-1 w-full bg-zinc-200"
                      />
                      {uploadProgress === 100 ? (
                        <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Parsing...
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <input
                    {...getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </Dropzone>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentsModal;
