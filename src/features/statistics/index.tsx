"use client";
import { GetDashboardInfo, GetRoutesByDelegate } from "@/app/actions";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import CommissionsStatisticsContainer from "./sections/commissions";
import PackagesStatisticsContainer from "./sections/packages";
import RoutesStatisticsContainer from "./sections/routes";

const StatisticsContainer = () => {
  const { user, selectedWarehouse } = useUser();

  const [statistics, setStatistics] = useState<DashboardItem[]>([]);
  const [chartData, setChartData] = useState<{
    collectedData: MoovinChartItem[];
    deliveredData: MoovinChartItem[];
  }>({ collectedData: [], deliveredData: [] });

  const [routeList, setRouteList] = useState<RouteShortData[]>();

  const handleGetDashboardInfo = useCallback(() => {
    if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
      GetDashboardInfo(user?.delegate?.idDelegate, selectedWarehouse.id).then(
        (res: DashboardInfoResponse) => {
          setStatistics(res.body);
          setChartData({
            collectedData: [
              {
                key: "Pendientes",
                value:
                  res.body.find((el) => el.idPackageStatus === 20)
                    ?.packageCount || 0,
                fill: "#013544",
              },
              {
                key: "Completados",
                value:
                  res.body.find((el) => el.idPackageStatus === 26)
                    ?.packageCount || 0,
                fill: "#2A9D90",
              },
              {
                key: "Fallidos",
                value:
                  res.body.find((el) => el.idPackageStatus === -5)
                    ?.packageCount || 0,
                fill: "#E8C468",
              },
            ],
            deliveredData: [
              {
                key: "Entregados",
                value:
                  (res.body.find((el) => el.idPackageStatus === 22)
                    ?.packageCount || 0) +
                  (res.body.find((el) => el.idPackageStatus === 7)
                    ?.packageCount || 0),
                fill: "#2A9D90",
              },
              {
                key: "Pendientes",
                value:
                  res.body.find((el) => el.idPackageStatus === 10)
                    ?.packageCount || 0,
                fill: "#013544",
              },
              {
                key: "Fallidos",
                value:
                  res.body.find((el) => el.idPackageStatus === 8)
                    ?.packageCount || 0,
                fill: "#E8C468",
              },
              {
                key: "Cancelados",
                value:
                  res.body.find((el) => el.idPackageStatus === 16)
                    ?.packageCount || 0,
                fill: "#AB2F2B",
              },
            ],
          });
        }
      );
    }
  }, [selectedWarehouse, user?.delegate?.idDelegate]);

  const handleGetRouteListData = useCallback(
    (page?: number, pageSize?: number) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRoutesByDelegate({
          idWarehouse: selectedWarehouse?.id,
          idDelegate: user?.delegate?.idDelegate,
          page,
          size: pageSize,
          idRouteStatus: 4,
        }).then((res: RouteGridResponse) => {
          const sortedRoutes = res.body.content?.sort((a, b) => {
            if (!a.createAt) return 1;
            if (!b.createAt) return -1;

            return (
              new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
            );
          });

          const limitedRoutes = sortedRoutes?.slice(0, 3) ?? [];
          setRouteList(limitedRoutes);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    handleGetDashboardInfo();
    handleGetRouteListData(0, 4);
  }, [selectedWarehouse]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row flex-grow h-full">
        <div className="flex flex-col flex-grow min-h-full">
          <RoutesStatisticsContainer
            routeList={routeList}
            statistics={statistics}
            collectedChartData={chartData.collectedData}
            deliveredChartData={chartData.deliveredData}
          />
        </div>
        {/* <div className="flex flex-col flex-grow min-h-full md:w-max">
          <CommissionsStatisticsContainer />
        </div> */}
      </div>

      <PackagesStatisticsContainer statistics={statistics} />
    </div>
  );
};

export default StatisticsContainer;
