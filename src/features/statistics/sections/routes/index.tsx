import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PieChartContainer } from "@/components/ui/pie-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOOVIN_URLS } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocationRow } from "./route-row";
import { ROUTE_COLORS } from "@/lib/utils";

type props = {
  statistics: DashboardItem[];
  deliveredChartData: MoovinChartItem[];
  collectedChartData: MoovinChartItem[];
  routeList: RouteShortData[] | undefined;
};

const RoutesStatisticsContainer = ({
  statistics,
  deliveredChartData,
  collectedChartData,
  routeList,
}: props) => {
  const router = useRouter();

  const [isCollected, setIsCollected] = useState<boolean>(false);

  const handleClick = (origin: string) => {
    router.push(
      origin === "routes" ? MOOVIN_URLS.ROUTES.MAIN : MOOVIN_URLS.PACKAGES.MAIN
    );
  };

  const chartConfig = {
    visitors: {
      label: "Estadísticas",
    },
    chrome: {
      label: "Pendiente",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  };

  const isLoadingData =
    collectedChartData.length === 0 || deliveredChartData.length === 0;

  return (
    <div className="flex flex-col pr-4 h-full">
      <Label className="text-[22px] font-semibold">Rutas</Label>
      <div className="flex flex-col md:flex-row w-full gap-4 mt-4 flex-grow">
        <div className="flex flex-col md:w-[60%] gap-4 h-full">
          <Card className="pt-6">
            <CardContent className="flex flex-col">
              <Label className="font-normal text-md text-[#64748B] flex flex-row justify-between items-center">
                Rutas activas
                <GetIcon iconName="location-icon" mainColor="black" />
              </Label>
              <Label className="text-3xl">
                {
                  statistics.find((el) => el.idPackageStatus == -2)
                    ?.packageCount
                }
              </Label>
            </CardContent>
          </Card>
          {/* ROUTE_COLORS[idx % ROUTE_COLORS.length] */}
          <Card className="pt-6 flex-grow">
            <CardContent className="flex flex-col h-full">
              <Label className="font-normal text-md text-[#64748B]">
                Listado rutas
              </Label>
              <div className="grid grid-cols-3 my-4">
                <div className="col-span-2">
                  <Label>Nombre</Label>
                </div>
                <div className="col-span-1">
                  <Label>Avance</Label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {routeList?.map((x, idx) => {
                  return (
                    <>
                      <LocationRow
                        location={x.routeName}
                        name={x.mooverName}
                        percentage={x.progress ?? 0}
                        progress={`${x.numberPackagesCompleted ?? 0}/${
                          (x.numberPackagesCollect ?? 0) +
                          (x.numberPackages ?? 0)
                        }`}
                        color={ROUTE_COLORS[idx % ROUTE_COLORS.length]}
                      />
                    </>
                  );
                })}
              </div>
              <Button
                variant={"white"}
                className="shadow-none w-fit self-center my-4 mt-auto"
                onClick={() => handleClick("routes")}
              >
                Ver rutas
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col md:w-[40%] gap-4 h-full">
          <Card className="pt-6 h-full">
            <CardContent className="flex flex-col">
              <Label className="font-normal text-md text-[#64748B] flex flex-row justify-between items-center">
                Paquetes en ruta
                <GetIcon iconName="truck-icon" className="w-[36px]"></GetIcon>
              </Label>

              <Label className="text-3xl">
                {
                  statistics.find((el) => el.idPackageStatus == 10)
                    ?.packageCount
                }
              </Label>
              <div className="my-2 flex justify-center items-center">
                <Tabs defaultValue="delivery">
                  <TabsList className="flex flex-col gap-2 md:flex-row md:justify-between bg-transparent p-0">
                    <div className="flex flex-row gap-2 p-1 rounded-md bg-gray justify-evenly">
                      <TabsTrigger
                        value="delivery"
                        onClick={() => {
                          setIsCollected(false);
                        }}
                      >
                        Entregar
                      </TabsTrigger>
                      <TabsTrigger
                        value="collect"
                        onClick={() => {
                          setIsCollected(true);
                        }}
                      >
                        Recolectar
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </Tabs>
              </div>
              <PieChartContainer
                isLoadingData={isLoadingData}
                chartData={
                  isCollected ? collectedChartData : deliveredChartData
                }
                chartConfig={chartConfig}
              />
              <Button
                variant={"white"}
                className="shadow-none w-fit self-center my-4"
                onClick={() => handleClick("packages")}
              >
                Ver paquetes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoutesStatisticsContainer;
