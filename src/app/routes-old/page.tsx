"use client";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/custom/button";
import Link from "next/link";
import { MOOVIN_URLS } from "@/utils/urls";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import { GetRoutesByDelegate } from "../actions";
import RoutesGrid from "@/features/routes/grid";
import { Card, CardContent } from "@/components/ui/card";
import Map from "@/components/custom/map";
import UnderConstruction from "@/components/under-construction-box";

type TabType = "grid" | "map";

const RoutesOldPage = () => {
  const { user, selectedWarehouse } = useUser();
  const [tabSelected, setTabSelected] = useState<TabType>("grid");
  const [gridResponse, setGridResponse] = useState<RouteGridResponse>();

  const handleGetGridData = useCallback(
    ({
      page,
      pageSize,
      filter,
    }: {
      page: number;
      pageSize: number;
      filter?: string;
    }) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRoutesByDelegate({
          idWarehouse: selectedWarehouse?.id,
          idDelegate: user?.delegate?.idDelegate,
          page,
          size: pageSize,
        }).then((res: RouteGridResponse) => {
          setGridResponse(res);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    handleGetGridData({ page: 0, pageSize: 10 });
  }, [tabSelected, selectedWarehouse, handleGetGridData]);

  const heightScreen = "75vh";

  const handleMarkerClick = (id: string) => {};
  const handleMultipleMarkerSelection = (ids: string[]) => {};

  return (
    <Dialog>
      <PageContainer title={"Rutas"}>
        <Tabs defaultValue="grid" className="my-2">
          <div>
            <TabsList className="flex flex-col gap-2 md:flex-row md:justify-between bg-white">
              <div className="flex flex-row gap-2 p-2 rounded-md bg-gray justify-evenly">
                <TabsTrigger
                  value="grid"
                  onClick={() => setTabSelected("grid")}
                >
                  Vista grilla
                </TabsTrigger>
                <TabsTrigger value="map" onClick={() => setTabSelected("map")}>
                  Vista mapa
                </TabsTrigger>
              </div>
              <div className="flex flex-row gap-2">
                <Link href={MOOVIN_URLS.PACKAGES.SCAN_PACKAGES}>
                  <Button iconName="load-packages" variant={"white"}>
                    Ingresar paquetes
                  </Button>
                </Link>
                <Link href={MOOVIN_URLS.ROUTES.NEW}>
                  <Button iconName="truck-icon" variant={"white"}>
                    Crear ruta
                  </Button>
                </Link>
              </div>
            </TabsList>
          </div>
          <TabsContent value="grid"></TabsContent>
          <TabsContent value="map">
            <Card className="flex justify-start items-center col-span-1 lg:col-span-5 min-h-[480px] h-[${heightScreen}] ">
              <CardContent className=" w-full p-0 overflow-hidden !rounded-sm">
                {/* {initialLocation[0] != 0 && initialLocation[1] != 0 && (
                  <Map
                    locations={[]}
                    selectedLocations={[]}
                    initialLocation={initialLocation}
                    height={heightScreen}
                    handleMarkerClick={handleMarkerClick}
                    handleMarkerSelectionArea={handleMultipleMarkerSelection}
                  />
                )} */}

                <UnderConstruction />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </Dialog>
  );
};

export default RoutesOldPage;
