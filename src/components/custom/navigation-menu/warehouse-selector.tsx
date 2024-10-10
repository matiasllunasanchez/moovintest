import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";

export function WarehouseSelector() {
  const { user, selectedWarehouse, changeWarehouse } = useUser();
  return (
    <div className="flex flex-row items-center gap-2 justify-center">
      <Label className="text-sm text-white">Bodega: </Label>
      <Select
        value={`${selectedWarehouse?.id}`}
        onValueChange={(value: string) => {
          if (value) {
            changeWarehouse(Number(value));
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccione bodega" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Bodegas</SelectLabel>
            {user?.warehouses?.map((item) => {
              return (
                <SelectItem
                  key={item.idWarehouse}
                  value={`${item.idWarehouse}`}
                >
                  {item.warehouseName}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
