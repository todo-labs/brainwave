import { UploadCloudIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";

import { cleanEnum } from "@/lib/utils";
import { Topics } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { UploadDropzone } from "@/hooks/useUploadthing";

const UploadDocumentModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [topic, setTopic] = useState<Topics>(Topics.MATH_I);
  const [subtopic, setSubtopic] = useState<string>("");

  const { isLoading, data } = api.meta.getSubtopics.useQuery(
    { topic },
    {
      enabled: !!topic,
    }
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <UploadCloudIcon size={16} className="mr-2" /> Upload
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload document</AlertDialogTitle>
          <div className="space-y-4">
            <Select
              onValueChange={(topic) => {
                setTopic(topic as Topics);
              }}
              value={topic}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Topics" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Topics).map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {cleanEnum(topic)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(subtopic) => {
                setSubtopic(subtopic as string);
              }}
              value={subtopic}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? "Loading..." : "Please select a subtopic"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <UploadDropzone
              endpoint="documents"
              input={{
                topic: topic,
                subtopic: subtopic,
              }}
              onClientUploadComplete={(res) => {
                toast({
                  title: "File uploaded successfully",
                });
                setOpen(false);
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Error!",
                  description: error.message,
                  variant: "destructive",
                });
              }}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UploadDocumentModal;
