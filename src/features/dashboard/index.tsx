import { GetDashboardInfo, GetRoutesByDelegate } from "@/app/actions";
import { useUser } from "@/contexts/UserContext";
import { Dialog } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import RoutesGrid from "../routes/grid";
import CardsDashboard from "./cards";
import ShortCuts from "./shortcuts";

const DashboardContainer = () => {
  const { user, selectedWarehouse } = useUser();
  const [dashboardInfo, setDashboardInfo] = useState<DashboardItem[]>([]);
  const [routesInfo, setRoutesInfo] = useState<RouteGridResponse>();

  const handleGetDashboardInfo = useCallback(() => {
    if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
      GetDashboardInfo(user?.delegate?.idDelegate, selectedWarehouse.id).then(
        (res: DashboardInfoResponse) => {
          setDashboardInfo(
            res.body
              .filter(
                (el) =>
                  el.idPackageStatus === 10 ||
                  el.idPackageStatus === 2 ||
                  el.idPackageStatus === -3
              )
              .sort((a, b) => b.idPackageStatus - a.idPackageStatus)
          );
        }
      );
    }
  }, [selectedWarehouse, user?.delegate?.idDelegate]);

  const handleGetRoutesData = useCallback(
    (page?: number, pageSize?: number) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRoutesByDelegate({
          idDelegate: user.delegate.idDelegate,
          idWarehouse: selectedWarehouse.id,
          page: page ? page : 0,
          size: pageSize ? pageSize : 10,
          idRouteStatus: 4,
        }).then((res: RouteGridResponse) => {
          setRoutesInfo(res);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    handleGetDashboardInfo();
    handleGetRoutesData();
  }, [selectedWarehouse]);
  return (
    <Dialog>
      <div className="flex flex-col bg-[#EFF4F6] w-full min-h-[200px] rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Hola, {user?.name}</h2>
        <ShortCuts />
      </div>

      {dashboardInfo.length > 0 ? (
        <div className="mt-4">
          <CardsDashboard dashboardInfo={dashboardInfo} />
        </div>
      ) : (
        <div className="flex flex-col items-center py-6">
          <div className="flex justify-center mb-6">
            <Image src="/moovin_logo.png" alt="Logo" width={150} height={50} />
          </div>
          <div className="flex items-center space-x-2">
            <Loader2 className="mr-2 h-10 w-10 animate-spin" />
          </div>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-6">Rutas iniciadas</h2>
        <RoutesGrid
          gridData={routesInfo}
          getData={(page: number, pageSize: number) =>
            handleGetRoutesData(page, pageSize)
          }
        />
      </div>
    </Dialog>
  );
};

export default DashboardContainer;
