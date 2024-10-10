import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type props = {
  route: RouteDetail;
  finalCashReceived: {
    cashColon: number;
    cashDollars: number;
  };
};

const RouteClosureStep4: React.FC<props> = ({ route, finalCashReceived }) => {
  return (
    <div className="flex flex-col p-6 gap-4">
      <Label className="text-xl">Ruta {route.nameRoute}</Label>

      <Label className="text-md text-[#64748B] font-light">
        Total Paquetes:
      </Label>
      <Separator />
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Total paquetes</Label>

        <Label className="text-md">{route.resumen?.total}</Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Recolecciones</Label>

        <Label className="text-md">{route.resumen?.collectpickup}</Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Envíos</Label>

        <Label className="text-md">{route.resumen?.delivered}</Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Devoluciones</Label>

        <Label className="text-md">
          {route.resumen?.faildelivery + route.resumen?.failedpickup}
        </Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Mensajero</Label>

        <Label className="text-md">{route.moover.name}</Label>
      </div>
      <Label className="text-md text-[#64748B] font-light">Pagos:</Label>
      <Separator />
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Total por cobrar Colones</Label>

        <Label className="text-md">{route.payments.totalAmountColon}</Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Total recibido Colones</Label>

        <Label className="text-md">{finalCashReceived.cashColon}</Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Total por cobrar Dolares</Label>

        <Label className="text-md">{route.payments.totalAmountDollars}</Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Total recibido Colones</Label>

        <Label className="text-md">{finalCashReceived.cashDollars}</Label>
      </div>
      <Label className="text-md text-[#64748B] font-light">Documentos:</Label>
      <Separator />
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">
          {route.documents.length} documentos
        </Label>
      </div>
      <div className="flex flex-row justify-between">
        <Label className="text-md font-light">Total recibido</Label>

        <Label className="text-md">{route.documents.length}</Label>
      </div>
    </div>
  );
};

export default RouteClosureStep4;
