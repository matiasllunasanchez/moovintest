import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/grid/data-table-column-header";

import { ActionColumn } from "./actions";
import { AddressColumn } from "./address";
import { Package } from "../schema";

const statuses = [
  {
    value: "confirmed",
    label: "Confirmado",
  },
  {
    value: "pending",
    label: "Pendiente",
  },
  {
    value: "cancelled",
    label: "Cancelado",
  },
];

export const columns: ColumnDef<Package>[] = [
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
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Dirección"
        className="w-full min-w-[400px]"
      />
    ),
    cell: ({ row }) => <AddressColumn row={row} />,
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Cliente"
        className="w-[200px]"
      />
    ),
    cell: ({ row }) => {
      const clientProfile: string = row.getValue("client");
      const clientName = clientProfile.split("-")[0];
      const profileName = clientProfile.split("-")[1];
      return (
        <div className="flex items-center">
          <span>
            {clientName}
            <br />
            {profileName}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "destinatary",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Destinatario"
        className="w-[250px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span> {row.getValue("destinatary")}</span>
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
      /*return (
        <>
          {statusLb && <Badge variant={variantBadge}>{statusLb.label}</Badge>}
        </>
      );*/
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: ({ column }) => <div className="w-[100px]"></div>,
    cell: ({ row }) => <ActionColumn row={row} />,
  },
];
