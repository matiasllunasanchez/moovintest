"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/grid/data-table-column-header";
import { ActionColumn } from "./actions";
import { Route } from "../schema";

const statuses = [
  {
    value: "delivered",
    label: "Entregado",
  },
  {
    value: "on_road",
    label: "En curso",
  },
];

export const columns: ColumnDef<Route>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nº ID"
        className="w-[80px]"
      />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "routeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre de ruta" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span> {row.getValue("routeName")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "routeDetail",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Detalle"
        className="w-[250px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span> {row.getValue("routeDetail")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "deliveredDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de inicio" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span> {row.getValue("deliveredDate")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "mooverName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mensajero" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span> {row.getValue("mooverName")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const statusLb = statuses.find(
        (status) => status.value === row.original.status
      );
      const variantBadge = statusLb?.value
        ? (statusLb?.value as "confirmed" | "cancelled" | "pending")
        : "default";
      return (
        <div className="flex items-center">
          <span> {row.getValue("status")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: ({ column }) => <div className="w-auto"></div>,
    cell: ({ row }) => <ActionColumn row={row} />,
  },
];
