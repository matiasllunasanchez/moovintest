"use client";
import { DataTable } from "@/components/grid/data-table";
import React, { useCallback, useEffect, useState } from "react";
import { columns } from "./shape/columns";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type PackageItem = {
  id: string;
  address: string;
  status: string;
  destinatary: string;
  client: string;
};

type Props = {
  gridData?: PackageGridResponse;
  getData?: ({
    page,
    pageSize,
    searchFilter,
  }: {
    page: number;
    pageSize: number;
    searchFilter?: string;
  }) => void;
  isLoading?: boolean;
};

const PackagesGrid = ({ gridData, getData, isLoading }: Props) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowData, setRowData] = useState<PackageItem[]>();
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [lastPagination, setLastPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (gridData && gridData.body && gridData.body.content) {
      const resultItems: PackageItem[] =
        gridData.body.content?.map((x) => {
          return {
            id: x.idPackage.toString(),
            address: x.address ?? "-",
            client: `${x.clientName}-${x.profileName}`,
            destinatary: x.nameContact ? x.nameContact : x.nameContactCollect,
            status: x.nameStatusTranslate ?? x.nameStatus,
          };
        }) ?? [];
      setRowData(resultItems);
    }
  }, [gridData]);

  const table = useReactTable({
    data: rowData ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    enableRowSelection: true,
    pageCount: gridData?.body.totalPages,
    manualPagination: true,
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

  useEffect(() => {
    if (
      getData &&
      (pagination.pageIndex != lastPagination.pageIndex ||
        pagination.pageSize != lastPagination.pageSize)
    ) {
      setLastPagination({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      });
      getData({ page: pagination.pageIndex, pageSize: pagination.pageSize });
    }
  }, [getData, lastPagination.pageIndex, lastPagination.pageSize, pagination]);

  const handleSearch = useCallback(
    (text: string) => {
      if (getData)
        getData({
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          searchFilter: text,
        });
    },
    [getData, pagination.pageIndex, pagination.pageSize]
  );

  return (
    <div className="mt-6">
      <DataTable
        table={table}
        columnToSearch="id"
        origen="Paquetes"
        isLoading={isLoading}
        onSubmitSearch={handleSearch}
        hasManualSearch
      />
    </div>
  );
};

export default PackagesGrid;
