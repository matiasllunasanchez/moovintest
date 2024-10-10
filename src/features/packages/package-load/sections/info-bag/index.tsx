import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type props = {
  readedBag: MoovinPackage;
};
const InfoBag: React.FC<props> = ({ readedBag }) => {
  return (
    <div className="flex flex-col w-full p-4 gap-1 md:gap-6">
      <div className="flex flex-row justify-between">
        <Label className="text-base md:text-xl flex flex-row items-center">
          <GetIcon
            iconName="package-box"
            className="hidden md:flex w-[20px] mr-2"
          ></GetIcon>
          Detalle de bolsa:{" "}
          {readedBag.body.bagCode && "#" + readedBag.body.bagCode}
        </Label>
      </div>

      <div>
        <Label className="text-[#64748B] hidden md:flex">Entregar a:</Label>
        <div className="flex flex-col mt-4 gap-1 md:grid md:grid-cols-3">
          <div>
            <Label className="text-[#64748B] font-normal">Destinatario</Label>
            <p className="font-semibold text-sm mt-2">
              {readedBag.body.delegateDestinationName || "-"}
            </p>
          </div>

          <div>
            <Label className="text-[#64748B] font-normal">
              Numero de seguimiento
            </Label>
            <p className="font-semibold text-sm mt-2">
              #{readedBag.body.bagCode || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 max-w-[350px]">
        <div>
          <Label className="text-[#64748B] font-normal">
            Cantidad de paquetes
          </Label>
          <p className="font-semibold text-sm mt-2">
            {readedBag.body.numberPackages}
          </p>
        </div>
        <div>
          <Label className="text-[#64748B] font-normal">Peso</Label>
          <p className="font-semibold text-sm mt-2">
            {readedBag.body.weight || "-" + " kg"}
          </p>
        </div>
      </div>
      <Separator className="border-t border-[#E4E4E7] my-2 md:my-0" />
      <div>
        <Label className="text-[#64748B] font-normal text-base hidden md:flex">
          Solictado por:
        </Label>
        <div className="flex flex-col mt-4 md:grid md:grid-cols-5">
          <div className="col-span-2">
            <Label className="text-[#64748B] font-normal">Remitente:</Label>
            <p className="font-semibold text-sm mt-2">
              {readedBag.body.idWarehouseOriginName || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBag;
