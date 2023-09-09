import type { Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, Tags, Trash } from "lucide-react";
import { format } from "date-fns";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/typography";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { cn, statusToColor } from "@/lib/utils";

interface DataTableRowActionsProps {
  row: Row<Report & { user: User }>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const utils = api.useContext();
  const { toast } = useToast();

  const deleteReportMutation = api.admin.removeReport.useMutation({
    async onSuccess() {
      toast({
        title: "Report deleted successfully",
        description: (
          <h3>
            Ticket Number: <span>{row.original.ticketNumber}</span> has been
            deleted`
          </h3>
        ),
      });
      await utils.admin.allReports.invalidate();
    },
    onError() {
      toast({
        title: "Failed to delete reminder",
        variant: "destructive",
      });
    },
  });

  const updateTicketStatusMutation = api.admin.updateTicketStatus.useMutation({
    async onSuccess() {
      toast({
        title: "Ticket status updated successfully",
        description: `Ticket Number: ${row.original.ticketNumber} is now ${row.original.status}`,
      });
      await utils.admin.allReports.invalidate();
    },
    onError() {
      toast({
        title: "Failed to update ticket status",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteReportMutation.mutateAsync(row.original.id);
    } catch (error) {
      console.error(error);
    }
  };

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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Ticket Number: {row.original.ticketNumber} and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {row.original.ticketNumber || "No Ticket Number"}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                        Status
                      </th>
                      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                        Created
                      </th>
                      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      <td
                        className={cn(
                          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                          statusToColor(row.original.status)
                        )}
                      >
                        {row.original.status}
                      </td>
                      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                        {format(row.original.createdAt, "MM/dd/yyyy")}
                      </td>
                      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                        {row.original.type}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Paragraph className="text-muted-foreground">
                {row.original.txt}
              </Paragraph>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </AlertDialog>
  );
}
