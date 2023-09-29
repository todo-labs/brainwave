"use client";

import { TrashIcon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ModifySubtopicRequestType } from "@/server/schemas";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

const RemoveSubtopicModal = ({
  topic,
  subtopic,
}: ModifySubtopicRequestType) => {
  const { toast } = useToast();
  const utils = api.useContext();

  const deleteSubtopicMutation = api.admin.removeSubtopic.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Successfully deleted subtopic ${subtopic} from ${topic}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
    onSettled: async () => await utils.meta.getSubtopics.invalidate({ topic }),
  });

  const handleDelete = async () => {
    try {
      await deleteSubtopicMutation.mutateAsync({
        topic,
        subtopic,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <TrashIcon className="h-4 w-4 text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            subtopic <span className="font-bold text-primary">{subtopic}</span>{" "}
            from <span className="font-bold text-primary">{topic}</span>. All
            documents in this subtopic will be moved to the parent topic. And
            users will no longer be able to access this subtopic as an exam
            topic.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveSubtopicModal;
