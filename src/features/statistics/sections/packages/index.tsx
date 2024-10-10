import { GetIcon } from "@/components/common/icon";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type props = {
  statistics: DashboardItem[];
};
const PackagesStatisticsContainer = ({ statistics }: props) => {
  return (
    <div className="flex flex-col h-full my-4">
      <Label className="text-[22px] font-semibold">Paquetes</Label>
      <div className="flex flex-col md:flex-row gap-4 mt-4 justify-between flex-grow h-full">
        <Card className="w-full bg-white  p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <Label className="text-[16px] text-[#64748B] align-middle">
              Total de paquetes sin asignar por entregar
            </Label>
            <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
          </div>
          <Label className="text-[32px] ">
            {statistics.find((el) => el.idPackageStatus === 3)?.packageCount ||
              0 +
                (statistics.find((el) => el.idPackageStatus === 21)
                  ?.packageCount || 0)}
          </Label>
        </Card>
        <Card className="w-full bg-white  p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <Label className="text-[16px] text-[#64748B] align-middle">
              Total de paquetes sin asignar por recolectar
            </Label>
            <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
          </div>
          <Label className="text-[32px] ">
            {statistics.find((el) => el.idPackageStatus === 2)?.packageCount ||
              0}
          </Label>
        </Card>
        <Card className="w-full bg-white  p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <Label className="text-[16px] text-[#64748B] align-middle">
              Total de paquetes recolectados
            </Label>
            <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
          </div>
          <Label className="text-[32px] ">
            {statistics.find((el) => el.idPackageStatus === 26)?.packageCount ||
              0}
          </Label>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4 justify-between flex-grow h-full">
        <Card className="w-full bg-white  p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <Label className="text-[16px] text-[#64748B] align-middle">
              Total de entregas fallidas
            </Label>
            <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
          </div>
          <Label className="text-[32px] ">
            {statistics.find((el) => el.idPackageStatus === 8)?.packageCount ||
              0}
          </Label>
        </Card>
        <Card className="w-full bg-white  p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <Label className="text-[16px] text-[#64748B] align-middle">
              Total de recolecciones fallidas
            </Label>
            <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
          </div>
          <Label className="text-[32px] ">
            {statistics.find((el) => el.idPackageStatus === -5)?.packageCount ||
              0}
          </Label>
        </Card>
        <Card className="w-full bg-white  p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <Label className="text-[16px] text-[#64748B] align-middle">
              Total de paquetes cancelados
            </Label>
            <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
          </div>
          <Label className="text-[32px] ">
            {statistics.find((el) => el.idPackageStatus === 16)?.packageCount ||
              0}
          </Label>
        </Card>
      </div>
    </div>
  );
};

export default PackagesStatisticsContainer;
