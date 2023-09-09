import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { type Report, type User } from "@prisma/client";
import { useMemo, useState } from "react";

import { DataTableColumnHeader } from "@/components/query-table/header";
import { Badge } from "@/components/ui/badge";
import Default from "@/components/ui/default";
import { DataTableRowActions } from "./row-actions";
import { DataTableToolbar } from "./toolbar";

import { cn, cleanEnum, statusToColor } from "@/lib/utils";
import { api } from "@/lib/api";
import { DataTable } from "@/components/query-table/data-table";

type ReportWithUser = Report & {
  user: User;
};

const columns: ColumnDef<ReportWithUser>[] = [
  {
    accessorKey: "ticketNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("ticketNumber")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "txt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Text" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className="capitalize">
            {row.original.type.toLowerCase()}
          </Badge>
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("txt")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span
            className={cn(
              "max-w-[500px] truncate font-medium capitalize",
              statusToColor(row.original.status)
            )}
          >
            {cleanEnum(row.original.status)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user: User = row.getValue("user");
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {user.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "last updated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 text-muted-foreground">
          {formatDistance(row.original.updatedAt, new Date(), {
            addSuffix: true,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

const ReportTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const { data, isLoading } = api.admin.allReports.useQuery({
    pageIndex,
    pageSize,
    query: searchTerm,
  });

  const table = useReactTable({
    data: data?.reports ?? defaultData,
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
      titleTx="listReports.loading.title"
      descriptionTx="listReports.loading.message"
      type="loading"
    />
  ) : (
    <DataTable
      toolbar={<DataTableToolbar table={table} />}
      columns={columns}
      emptyTx="listReports.empty.title"
      emptyDescTx="listReports.empty.message"
      table={table}
    />
  );
};

export default ReportTable;
