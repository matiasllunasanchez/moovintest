import { GetIcon } from "@/components/common/icon";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Props = {
  dashboardInfo: DashboardItem[];
};
const CardsDashboard = ({ dashboardInfo }: Props) => {
  return (
    <div className="flex flex-col w-full  rounded-lg py-6">
      <h2 className="text-2xl font-bold mb-6">Paquetes</h2>
      <div className="flex flex-col items-stretch md:flex-row w-full justify-center gap-4 mb-2">
        {dashboardInfo.map((di) => {
          return (
            <Card className="w-full bg-white  p-4" key={di.statusTranslate}>
              <div className="flex flex-row justify-between items-center mb-4">
                <Label className="text-[16px] text-[#64748B] align-middle">
                  {di.idPackageStatus === 10
                    ? "Paquetes en ruta por entregar"
                    : di.idPackageStatus === 2
                    ? "Paquetes por recoger sin asignar"
                    : "Paquetes en sede"}
                </Label>
                <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
              </div>
              <Label className="text-[32px] ">{di.packageCount}</Label>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardsDashboard;
