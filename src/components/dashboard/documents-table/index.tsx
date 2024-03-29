import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { type Document } from "@prisma/client";
import { useMemo, useState } from "react";

import { DataTableColumnHeader } from "@/components/query-table/header";
import Default from "@/components/default";
import { DataTableRowActions } from "./row-actions";
import { DataTableToolbar } from "./toolbar";

import { cleanEnum } from "@/lib/utils";
import { api } from "@/lib/api";
import { DataTable } from "@/components/query-table/data-table";
import { Loader2Icon } from "lucide-react";

const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.original.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">{cleanEnum(row.original.type)}</div>
      );
    },
  },
  {
    accessorKey: "topic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {cleanEnum(row.original.topic)}
          </span>
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.subtopic}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "uploaded",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 text-muted-foreground">
          {format(row.original.createdAt, "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

const DocumentsTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const defaultData = useMemo(() => [], []);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { data, isLoading } = api.admin.allDocuments.useQuery({
    pageIndex,
    pageSize,
    query: searchTerm,
  });

  const table = useReactTable({
    data: data?.documents ?? defaultData,
    columns,
    pageCount: Math.ceil((data?.count || 0) / pageSize),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter: searchTerm,
    },
    manualPagination: true,
    enableRowSelection: true,
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
    onGlobalFilterChange: setSearchTerm,
  });

  return isLoading ? (
    <Default
      title="Loading Documents"
      description="Please wait while we load all documents."
      icon={Loader2Icon}
      iconClassName="animate-spin"
    />
  ) : (
    <DataTable<Document>
      columns={columns}
      toolbar={<DataTableToolbar table={table} />}
      empty="No Documents found."
      emptyDesc="Please try again later."
      table={table}
    />
  );
};

export default DocumentsTable;
