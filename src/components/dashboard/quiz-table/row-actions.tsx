import type { Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, Trash } from "lucide-react";
import type { Questions, Quiz } from "@prisma/client";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import useStore from "@/hooks/useStore";

interface DataTableRowActionsProps {
  row: Row<Quiz & {
    questions: Questions[];
  }>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const utils = api.useContext();
  const { toast } = useToast();
  const router = useRouter();

  const { setCurrentQuiz, setCurrentStep } = useStore();

  const deleteMutation = api.admin.removeQuiz.useMutation({
    async onSuccess() {
      toast({
        title: "Success",
        description: `The ${row.original.topic} quiz has been deleted.`,
      });
      await utils.admin.allUsers.invalidate();
    },
    onError() {
      toast({
        title: "Something went wrong",
        description: `The ${row.original.topic} quiz could not be deleted.`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(row.original.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
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
          <DropdownMenuItem onClick={() => {
            setCurrentQuiz(row.original);
            setCurrentStep("result");
            router.push("/home")
          }}>
            <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            View
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
            This action cannot be undone. This will permanently delete this
            quiz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
