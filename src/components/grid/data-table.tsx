"use client";
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table as ReactTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData> {
  table: ReactTable<TData>;
  columnToSearch?: string;
  origen: string;
  isLoading?: boolean;
  hasManualSearch?: boolean;
  onSubmitSearch?: (text: string) => void;
}

export function DataTable<TData>({
  table,
  columnToSearch,
  origen,
  isLoading = false,
  hasManualSearch = false,
  onSubmitSearch,
}: DataTableProps<TData>) {
  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        columnToSearch={columnToSearch}
        hasSearchButton={hasManualSearch}
        externalSearch={onSubmitSearch}
      />
      <div className="rounded-md border-slate-200 border border-solid">
        <Table>
          <TableHeader className="bg-gray">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length ?? 0}>
                    <div className="flex flex-col gap-2 ">
                      <div className="flex justify-center items-center space-x-2 h-20">
                        <Loader2 className="mr-2 h-10 w-10 animate-spin opacity-30" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
                      colSpan={table.getAllColumns().length ?? 0}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination rowsData={false} table={table} origen={origen} />
    </div>
  );
}
