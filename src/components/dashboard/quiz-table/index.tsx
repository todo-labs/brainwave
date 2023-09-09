import {
  useReactTable,
  type ColumnDef,
  VisibilityState,
  ColumnFiltersState,
  SortingState,
  PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import type { Questions, Quiz, User } from "@prisma/client";
import { useMemo, useState } from "react";
import { Loader2Icon } from "lucide-react";

import { DataTable } from "@/components/query-table/data-table";
import { DataTableColumnHeader } from "@/components/query-table/header";
import { Badge } from "@/components/ui/badge";
import Default from "@/components/default";
import { DataTableRowActions } from "./row-actions";

import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";

type Column = Quiz & {
  user: User | null;
  questions: Questions[];
};

const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "topic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[100px] capitalize">
          {cleanEnum(row.getValue("topic")).toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "subtopic",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subtopic" />
    ),
    cell: ({ row }) => {
      return <div className="w-[100px]">{row.getValue("subtopic")}</div>;
    },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Difficulty" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("difficulty")}</Badge>;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => {
      return <div className="w-[50px]">{row.getValue("score")}</div>;
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user: User = row.getValue("user");

      if (user) {
        return <div className="w-[100px]">{user.name}</div>;
      }
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export const QuizTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const defaultData = useMemo(() => [], []);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { data, isLoading } = api.admin.allQuizzes.useQuery({
    pageIndex,
    pageSize,
    sortAsc: sorting[0]?.desc,
    query: searchQuery,
  });

  const table = useReactTable({
    data: data?.quizzes ?? defaultData,
    columns,
    pageCount: Math.ceil((data?.count || 0) / pageSize),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    manualPagination: true,
    enableRowSelection: true,
    debugTable: true,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return isLoading ? (
    <Default
      title="Loading user data"
      description="Please wait while we load the user data."
      icon={Loader2Icon}
      iconClassName="animate-spin"
    />
  ) : (
    <DataTable
      columns={columns}
      emptyDescTx="defaultHome.loading.message"
      emptyTx="defaultHome.empty.title"
      table={table}
    />
  );
};

export default QuizTable;
