import { Row } from "@tanstack/react-table";
import { Button } from "@/components/custom/button";
import { routeSchema } from "../schema";
import { useRouter } from "next/navigation";
import { MOOVIN_URLS } from "@/utils/urls";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function ActionClosureColumn<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const routeItem = routeSchema.parse(row.original);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="black"
          onClick={() =>
            router.push(MOOVIN_URLS.ROUTES.CLOSE_ROUTE(routeItem.id))
          }
        >
          Cerrar
        </Button>
      </div>
    </>
  );
}
