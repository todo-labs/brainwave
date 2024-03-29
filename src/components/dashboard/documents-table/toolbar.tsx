"use client";

import { BlendingModeIcon, Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { type Document, Topics, DocumentType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/query-table/view-options";
import { DataTableFacetedFilter } from "./filter";
import { AtomIcon, BookOpenIcon, CalculatorIcon, FileIcon, FileTextIcon, FlagIcon, GlobeIcon, LeafIcon } from "lucide-react";
import UploadDocumentModal from "@/modals/UploadDocument";

interface DataTableToolbarProps {
  table: Table<Document>;
}

export function DataTableToolbar({
  table,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const topics = [
    {
      value: Topics.LITERATURE,
      label: "Literature",
      icon: BookOpenIcon,
    },
    {
      value: Topics.US_HISTORY,
      label: "US History",
      icon: FlagIcon,
    },
    {
      value: Topics.WORLD_HISTORY,
      label: "World History",
      icon: GlobeIcon,
    },
    {
      value: Topics.MATH_I,
      label: "Math I",
      icon: CalculatorIcon,
    },
    {
      value: Topics.MATH_II,
      label: "Math II",
      icon: CalculatorIcon,
    },
    {
      value: Topics.BIOLOGY_E,
      label: "Biology E",
      icon: LeafIcon,
    },
    {
      value: Topics.BIOLOGY_M,
      label: "Biology M",
      icon: LeafIcon,
    },
    {
      value: Topics.CHEMISTRY,
      label: "Chemistry",
      icon: BlendingModeIcon,
    },
    {
      value: Topics.PHYSICS,
      label: "Physics",
      icon: AtomIcon,
    },
  ];

  const docTypes = [
    {
      value: DocumentType.PDF,
      label: "PDF",
      icon: FileTextIcon
    },
    {
      value: DocumentType.DOC,
      label: "DOC",
      icon: FileIcon,
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Documents..."
          value={table.getState().globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[250px] lg:w-[250px]"
        />
        {table.getColumn("topic") && (
          <DataTableFacetedFilter
            column={table.getColumn("topic")}
            title="Topics"
            options={topics}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={docTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <UploadDocumentModal />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
