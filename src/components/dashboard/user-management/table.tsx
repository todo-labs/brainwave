import type { ColumnDef } from "@tanstack/react-table";
import type { Quiz, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { BatteryWarningIcon, Loader2Icon, User2Icon } from "lucide-react";

import { DataTable } from "@/components/query-table/data-table";
import { DataTableColumnHeader } from "@/components/query-table/header";
import { DataTableRowActions } from "./row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import DefaultState from "@/components/default";

import { api } from "@/lib/api";

// type Column = User & { quizzes: Quiz[] };

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name") || "Anonymous"}
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
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Joined" />
  //   ),
  //   cell: ({ row }) => {
  //     console.log(row)
  //     const date = new Date(row.getValue("createdAt"));

  //     if (!date) {
  //       return <Badge color="red">Not verified</Badge>;
  //     }

  //     const status = formatDistanceToNow(date, {
  //       addSuffix: true,
  //     });

  //     return <div className="w-[80px]">{status}</div>;
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "quizzes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed Quizzes" />
    ),
    cell: ({ row }) => {
      // get status based on date
      const data = row.getValue("quizzes");
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return <Badge variant="destructive">No data</Badge>;
      } else if (Array.isArray(data) && data.length > 0) {
        return <div className="w-[100px] text-center">{data.length}</div>;
      }
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "credits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credits" />
    ),
    cell: ({ row }) => {
      return <div className="w-[100px]">{row.getValue("credits")}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

const UserTable = () => {
  const { data, isLoading, isError, refetch } =
    api.admin.allUsers.useQuery(undefined);

  return isLoading ? (
    <DefaultState
      icon={Loader2Icon}
      iconClassName="animate-spin"
      title="Loading Users"
      description="Please wait while we load all the users"
    />
  ) : isError ? (
    <DefaultState
      icon={BatteryWarningIcon}
      title="Error loading Users"
      description="Something went wrong while loading the experiments"
      btnText="Retry"
      onClick={void refetch()}
    />
  ) : (
    <DataTable
      data={data}
      columns={columns}
      emptyState={
        <DefaultState
          title="No Users"
          description="No users found"
          icon={User2Icon}
        />
      }
    />
  );
};

export default UserTable;
