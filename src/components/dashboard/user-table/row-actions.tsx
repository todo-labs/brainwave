import type { Row } from "@tanstack/react-table";
import {
  Copy,
  EyeIcon,
  MoreHorizontal,
  Star,
  Tags,
  MailCheckIcon,
  Trash,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import type { User } from "@prisma/client";

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
import { toast, useToast } from "@/hooks/useToast";

interface DataTableRowActionsProps {
  row: Row<User>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const utils = api.useContext();
  const { toast } = useToast();

  const deleteUserMutation = api.admin.removeUser.useMutation({
    async onSuccess() {
      // toast.success("User deleted successfully");
      toast({
        title: "User deleted successfully",
        description: `The user ${row.original.name} has been deleted.`,
      });
      await utils.admin.allUsers.invalidate();
    },
    onError() {
      toast({
        title: "Something went wrong",
        description: `The user ${row.original.name} could not be deleted.`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(row.original.id);
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
            <DropdownMenuItem>
              <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MailCheckIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Alert
            </DropdownMenuItem>
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
              {row.original.name} account and all of their data.
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
              {row.original.name || "Anonymous"}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <Paragraph className="text-muted-foreground/70"></Paragraph>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AlertDialog>
  );
}
