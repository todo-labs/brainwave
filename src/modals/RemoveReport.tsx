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
import { Report } from "@prisma/client";

const RemoveReportModal = (props: Pick<Report, "id" | "ticketNumber">) => {
  const { toast } = useToast();
  const utils = api.useContext();

  const deleteReportMutation = api.admin.removeReport.useMutation({
    async onSuccess() {
      toast({
        title: "Report deleted successfully",
        description: (
          <h3>
            Ticket Number:{" "}
            <span className="font-bold text-primary">{props.ticketNumber}</span>{" "}
            has been deleted
          </h3>
        ),
      });
    },
    onError(error) {
      toast({
        title: "Failed to delete report",
        description: error.message || "unknown error",
        variant: "destructive",
      });
    },
    onSettled: async () => await utils.admin.allReports.invalidate(),
  });

  const handleDelete = async () => {
    try {
      await deleteReportMutation.mutateAsync(props.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the Ticket
          Number:{" "}
          <span className="font-bold text-primary">{props.ticketNumber}</span>{" "}
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

export default RemoveReportModal;
