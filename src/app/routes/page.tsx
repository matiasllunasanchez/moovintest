"use client";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/custom/button";
import Link from "next/link";
import { MOOVIN_URLS } from "@/utils/urls";
import { Dialog } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GetRouteWithPackagesList, GetUnassignedPackages } from "../actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import InteractiveMapSection from "@/features/routes/maps/interactive-map";
import { ROUTE_COLORS } from "@/lib/utils";

type TabType = "created" | "active";

const RoutesPage = () => {
  const { user, selectedWarehouse } = useUser();
  const [createdRouteListResponse, setCreatedRouteListResponse] = useState<
    RouteShortData[]
  >([]);
  const [deleteRoute, setDeleteRoute] = useState<boolean>(false);

  const [startedRouteListResponse, setStartedRouteListResponse] = useState<
    RouteShortData[]
  >([]);

  const [unassignedPackageLocations, setUnassignedPackagesLocations] =
    useState<RouteShortData>({
      packages: [],
      idRoute: -1,
      color: "#636363",
    });
  const [tabSelected, setTabSelected] = useState<TabType>("created");

  const handleGetStartedRouteListData = useCallback(
    ({ page = 0, pageSize = -1 }: { page?: number; pageSize?: number }) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRouteWithPackagesList({
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          page,
          size: pageSize,
          idRouteStatus: 4,
        }).then((res: ShortRouteWithPackagesGridResponse) => {
          const result: RouteShortData[] = res.body.map((x, idx) => {
            return {
              ...x,
              color: ROUTE_COLORS[idx % ROUTE_COLORS.length],
            };
          });

          setStartedRouteListResponse(result);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  const handleGetCreatedRouteListData = useCallback(
    ({ page = 0, pageSize = -1 }: { page?: number; pageSize?: number }) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRouteWithPackagesList({
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          page,
          size: pageSize,
          idRouteStatus: 1,
        }).then((res: ShortRouteWithPackagesGridResponse) => {
          const result: RouteShortData[] = res.body.map((x, idx) => {
            return {
              ...x,
              color: ROUTE_COLORS[idx % ROUTE_COLORS.length],
            };
          });
          setCreatedRouteListResponse(result);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  const handleGetUnassignedPackagesListData = useCallback(
    ({
      page = 0,
      pageSize = -1,
      filter,
    }: {
      page?: number;
      pageSize?: number;
      filter?: string;
    }) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetUnassignedPackages({
          idDelegate: user.delegate.idDelegate,
          idWarehouse: selectedWarehouse.id,
        }).then((res: ShortPackageGridResponse) => {
          setUnassignedPackagesLocations({
            ...unassignedPackageLocations,
            packages: res.body,
          });
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  const refreshLocations = () => {
    handleGetUnassignedPackagesListData({ page: 0, pageSize: -1 });
    handleGetCreatedRouteListData({ page: 0, pageSize: -1 });
    handleGetStartedRouteListData({ page: 0, pageSize: -1 });
  };

  useEffect(() => {
    deleteRoute === true && setDeleteRoute(false);
    refreshLocations();
  }, [
    selectedWarehouse,
    handleGetStartedRouteListData,
    handleGetCreatedRouteListData,
    handleGetUnassignedPackagesListData,
    tabSelected,
    deleteRoute,
  ]);

  const tabComponent = useMemo(() => {
    return (
      <div className="flex flex-col mb-6 gap-3">
        <Label className="text-lg overflow-hidden font-semibold">
          Listado de rutas
        </Label>
        <TabsList className="flex flex-col gap-2 md:flex-row md:justify-between bg-transparent p-0">
          <div className="flex flex-row gap-2 p-2 rounded-md bg-gray justify-evenly">
            <TabsTrigger
              value="created"
              onClick={() => setTabSelected("created")}
            >
              Creadas
            </TabsTrigger>
            <TabsTrigger
              value="active"
              onClick={() => setTabSelected("active")}
            >
              Activas
            </TabsTrigger>
          </div>
        </TabsList>
      </div>
    );
  }, []);
  createdRouteListResponse;

  // TODO: BORRAR CUANDO ARREGLEN EL BACKEND. DEBEN VENIR FILTRADOS YA.
  /*const filteredPackages = unassignedPackageLocations.packages?.filter((pk) => {
    const assignedPackageIds = new Set<number>();
    createdRouteListResponse.forEach((route) => {
      route.packages?.forEach((pkg) => assignedPackageIds.add(pkg.idPackage));
    });
    return !assignedPackageIds.has(pk.idPackage);
  });
*/
  return (
    <Dialog>
      <PageContainer
        title={"Rutas"}
        aside={
          <div className="flex flex-row gap-2">
            <Link href={MOOVIN_URLS.ROUTES.HISTORY}>
              <Button variant={"white"}>Histórico de rutas</Button>
            </Link>
            <Link href={MOOVIN_URLS.ROUTES.NEW_ROUTE}>
              <Button variant={"primary"}>Nueva ruta</Button>
            </Link>
          </div>
        }
      >
        <Tabs defaultValue="created">
          <TabsContent value="created">
            <InteractiveMapSection
              routes={[
                {
                  ...unassignedPackageLocations,
                  packages: unassignedPackageLocations.packages,
                },
                ...createdRouteListResponse,
              ]}
              headerNode={tabComponent}
              onSelectLocation={refreshLocations}
              setDeleteRoute={setDeleteRoute}
            />
          </TabsContent>
          <TabsContent value="active">
            <InteractiveMapSection
              routes={[
                {
                  ...unassignedPackageLocations,
                  packages: unassignedPackageLocations.packages,
                },
                ...startedRouteListResponse,
              ]}
              headerNode={tabComponent}
              onSelectLocation={refreshLocations}
              setDeleteRoute={setDeleteRoute}
            />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </Dialog>
  );
};

export default RoutesPage;
