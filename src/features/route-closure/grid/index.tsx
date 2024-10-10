"use client";
import { DataTable } from "@/components/grid/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./shape/columns";
import {
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

type RouteItem = {
  id: string;
  routeName: string;
  routeDetail: string;
  status: string;
  deliveredDate: string;
  mooverName: string;
};

type Props = {
  gridData?: RouteGridResponse;
  getData?: (page: number, pageSize: number) => void;
};

const RoutesClosureGrid = ({ gridData, getData }: Props) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowData, setRowData] = useState<RouteItem[]>();
  const [lastPagination, setLastPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (gridData) {
      const resultItems: RouteItem[] =
        gridData.body.content.map((x) => {
          return {
            id: x.idRoute ? x.idRoute.toString() : "",
            routeName: x.routeName ?? "",
            routeDetail:
              "Paquetes: " +
              x.numberPackages +
              " - Paquetes a recoger: " +
              x.numberPackagesCollect,
            deliveredDate: x.deliveredDate ?? "",
            mooverName: x.mooverName ? x.mooverName : "",
            status: x.routeStatusDescription
              ? x.routeStatusDescription
              : "unknown",
          };
        }) ?? [];
      setRowData(resultItems);
    }

    //setRowData(routes_fakedata as RouteItem[]); // FAKE DATA
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
    autoResetPageIndex: false,
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
      getData(pagination.pageIndex, pagination.pageSize);
    }
  }, [pagination]);

  return (
    <div className="mt-6">
      <DataTable
        table={table}
        origen="Rutas"
        // columnToSearch="id"
      />
    </div>
  );
};

export default RoutesClosureGrid;
