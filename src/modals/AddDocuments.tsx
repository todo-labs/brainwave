"use client";

import * as z from "zod";
import { Topics } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import {
  ModifySubtopicRequestType,
  modifySubtopicSchema,
} from "@/server/schemas";
import { FileSpreadsheet, UploadCloudIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { cleanEnum } from "@/lib/utils";

const AddDocumentsModal = (props: ModifySubtopicRequestType) => {
  const { toast } = useToast();

  const steps = [
    {
      title: "Find Documents",
      description: "Find documents to add to the subtopic",
      icon: <MagnifyingGlassIcon className="h-4 w-4" />,
      action: () => {},
    },
    {
      title: "Parse Documents",
      description: "Parse the documents to extract the content",
      icon: <FileSpreadsheet className="h-4 w-4" />,
      action: () => {},
    },
    {
      title: "Upload Documents",
      description: "Upload the documents to the subtopic",
      icon: <UploadCloudIcon className="h-4 w-4" />,
      action: () => {},
    },
  ];

  const [currentStep, setCurrentStep] = useState<number>(0);

  const utils = api.useContext();

  const addSubtopic = api.admin.addSubtopic.useMutation({
    onSuccess: async () => {
      toast({
        title: "Subtopic Added",
        description: "The subtopic has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error with adding subtopic",
        description: error.message || "There was an error adding the subtopic",
        variant: "destructive",
      });
    },
    onSettled: async () => await utils.meta.getSubtopics.reset(),
  });

  async function onSubmit(values: z.infer<typeof modifySubtopicSchema>) {
    try {
      await addSubtopic.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="float-right">
        {props.subtopic !== "" && (
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
                {cleanEnum(props.topic || "")}
              </span>
            </p>
            <p>
              Subtopic:{" "}
              <span className="font-bold text-primary">{props.subtopic}</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <Alert>
          {steps[currentStep]?.icon}
          <AlertTitle>{steps[currentStep]?.title}</AlertTitle>
          <AlertDescription>{steps[currentStep]?.description}</AlertDescription>
        </Alert>
        {currentStep === 0 && (
          <div className="flex h-[200px] flex-col items-center justify-center space-y-3 border border-dashed">
            <p className="text-gray-400">
              Documents will appear here once found
            </p>
          </div>
        )}
        <Button type="submit" onClick={steps[currentStep]?.action}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentsModal;
