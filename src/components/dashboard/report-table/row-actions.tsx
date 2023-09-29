import type { Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, Tags, Trash } from "lucide-react";
import { type Report, ReportStatus, User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ViewReportModal from "@/modals/ViewReport";
import RemoveReportModal from "@/modals/RemoveReport";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { cn, statusToColor } from "@/lib/utils";

interface DataTableRowActionsProps {
  row: Row<Report & { user: User }>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const utils = api.useContext();
  const { toast } = useToast();

  const updateTicketStatusMutation = api.admin.updateTicketStatus.useMutation({
    async onSuccess(data) {
      toast({
        title: "Ticket status updated successfully",
        description: (
          <h3>
            Ticket Number:{" "}
            <span className="font-bold text-primary">
              {row.original.ticketNumber}
            </span>{" "}
            is now{" "}
            <span className={cn(statusToColor(data.status))}>
              {data.status}
            </span>
          </h3>
        ),
      });
    },
    onError() {
      toast({
        title: "Failed to update ticket status",
        variant: "destructive",
      });
    },
    onSettled: async () => await utils.admin.allReports.invalidate(),
  });

  const handleUpdateTicketStatus = async (status: ReportStatus) => {
    try {
      await updateTicketStatusMutation.mutateAsync({
        id: row.original.id,
        status,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                View
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Update Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={row.original.status}>
                  {Object.keys(ReportStatus).map((label) => (
                    <DropdownMenuRadioItem
                      key={label}
                      value={label}
                      onClick={() =>
                        void handleUpdateTicketStatus(label as ReportStatus)
                      }
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <RemoveReportModal {...row.original} />
        <ViewReportModal {...row.original} />
      </Dialog>
    </AlertDialog>
  );
}
