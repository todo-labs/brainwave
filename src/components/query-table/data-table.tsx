import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Default from "@/components/default";

import { DataTablePagination } from "./pagination";
import type { TxKeys } from "types";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  empty: string;
  emptyDesc: string;
  table: ReactTable<TData>;
  toolbar?: React.ReactNode;
}

export function DataTable<TData>({
  columns,
  empty,
  emptyDesc,
  table,
  toolbar,
}: DataTableProps<TData>) {
  return (
    <div className="space-y-4">
      {toolbar && toolbar}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-20 text-center"
                >
                  <Default
                    title={empty}
                    description={emptyDesc}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
