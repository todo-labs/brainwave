import type { Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, Trash } from "lucide-react";
import { type Document } from "@prisma/client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";

import DeleteDocumentModal from "@/modals/DeleteDocument";

interface DataTableRowActionsProps {
  row: Row<Document>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
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
            <DropdownMenuItem>
              <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              <Link href={row.original.url} target="_blank">
                View
              </Link>
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
        <DeleteDocumentModal {...row.original} />
      </Dialog>
    </AlertDialog>
  );
}
