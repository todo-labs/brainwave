import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import { type Document } from "@prisma/client";
import Link from "next/link";

const DeleteDocumentModal = (props: Pick<Document, "key" | "name" | "url">) => {
  const { toast } = useToast();
  const utils = api.useUtils();

  const deleteReportMutation = api.admin.deleteDocument.useMutation({
    onSuccess() {
      toast({
        title: "Success",
        description: (
          <h3>
            Document:{" "}
            <span className="font-bold text-primary">{props.name}</span>{" "}
            has been deleted
          </h3>
        ),
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message || "unknown error",
        variant: "destructive",
      });
    },
    onSettled: async () => await utils.admin.allDocuments.invalidate(),
  });

  const handleDelete = async () => {
    try {
      await deleteReportMutation.mutateAsync(props.key);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the following
          document:{" "}
          <Link href={props.url} className="font-bold text-primary">{props.name}</Link>{" "}
          and all of its data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteDocumentModal;
