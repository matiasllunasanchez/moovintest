import { Row } from "@tanstack/react-table";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/custom/button";
import WhatsAppContactButton from "@/components/common/whatsapp-button";
import { routeSchema } from "../schema";
import { useRouter } from "next/navigation";
import { MOOVIN_URLS } from "@/utils/urls";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function ActionColumn<TData>({ row }: DataTableRowActionsProps<TData>) {
  const routeItem = routeSchema.parse(row.original);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row gap-2 justify-end">
        <DialogTrigger asChild>
          <Button
            variant="black"
            onClick={() => router.push(MOOVIN_URLS.ROUTES.DETAIL(routeItem.id))}
          >
            Detalle
          </Button>
        </DialogTrigger>
      </div>
    </>
  );
}
