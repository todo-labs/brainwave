import {
  useReactTable,
  type ColumnDef,
  type VisibilityState,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Role, type Quiz, type User } from "@prisma/client";

import { DataTable } from "@/components/query-table/data-table";
import { DataTableColumnHeader } from "@/components/query-table/header";
import { Badge } from "@/components/ui/badge";
import Default from "@/components/default";
import { DataTableRowActions } from "./row-actions";
import { useMemo, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { api } from "@/lib/api";

type Column = User & {
  quizzes?: Quiz[];
};

const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const isAdmin = row.original.role === Role.ADMIN;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name") || "Anonymous"}
            {isAdmin && (
              <Badge variant="outline" className="ml-4">
                Admin
              </Badge>
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <div className="w-[100px]">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "quizzes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# of Quizzes" />
    ),
    cell: ({ row }) => {
      const quizzes: Quiz[] = row.getValue("quizzes");

      if (!quizzes || (Array.isArray(quizzes) && quizzes.length === 0)) {
        return <h3 className="font-medium text-destructive">0</h3>;
      } else if (Array.isArray(quizzes) && quizzes.length > 0) {
        return <div className="w-[100px] flex flex-row-reverse">{quizzes.length}</div>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export const UserTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery] = useState("");
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

  const { data, isLoading } = api.admin.allUsers.useQuery({
    pageIndex,
    pageSize,
    sortAsc: sorting[0]?.desc,
    query: searchQuery,
  });

  const table = useReactTable({
    data: data?.users ?? defaultData,
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
    <DataTable<Column>
      columns={columns}
      emptyDesc="Users are not available at the moment."
      empty="No users found"
      table={table}
    />
  );
};

export default UserTable;
