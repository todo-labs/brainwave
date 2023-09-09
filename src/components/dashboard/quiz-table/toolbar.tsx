"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Topics } from "@prisma/client";
import {
  AtomIcon,
  BookIcon,
  CalculatorIcon,
  DropletIcon,
  HistoryIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/query-table/view-options";
import { DataTableFacetedFilter } from "@/components/query-table/filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const topicsArray = [
    {
      value: Topics.LITERATURE,
      label: "Literature",
      icon: BookIcon,
    },
    {
      value: Topics.US_HISTORY,
      label: "US History",
      icon: HistoryIcon,
    },
    {
      value: Topics.WORLD_HISTORY,
      label: "World History",
      icon: HistoryIcon,
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
      label: "Biology (Ecology)",
      icon: DropletIcon,
    },
    {
      value: Topics.BIOLOGY_M,
      label: "Biology (Molecular)",
      icon: DropletIcon,
    },
    {
      value: Topics.CHEMISTRY,
      label: "Chemistry",
      icon: AtomIcon,
    },
    {
      value: Topics.PHYSICS,
      label: "Physics",
      icon: AtomIcon,
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Reports..."
          value={table.getState().globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[250px] lg:w-[250px]"
        />
        {table.getColumn("topic") && (
          <DataTableFacetedFilter
            column={table.getColumn("topic")}
            title="Topics"
            options={topicsArray}
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
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
