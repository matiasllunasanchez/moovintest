"use client";
import PageContainer from "@/components/page-container";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import InteractiveMapSection from "@/features/routes/maps/interactive-map";
import { GetRouteWithPackagesList, GetUnassignedPackages } from "@/app/actions";
import { useParams } from "next/navigation";
import { mapUnassignedPackagesToShortPackage, ROUTE_COLORS } from "@/lib/utils";

type TabType = "created" | "active";

const AssignPackagesPage = () => {
  const { routeId } = useParams();
  const { user, selectedWarehouse } = useUser();
  const [routeListResponse, setRouteListResponse] = useState<RouteShortData[]>(
    []
  );
  // const [tabSelected, setTabSelected] = useState<TabType>("created");
  const [unassignedPackageLocations, setUnassignedPackagesLocations] =
    useState<RouteShortData>({
      packages: [],
      idRoute: -1,
      color: "#636363",
    });

  const handleGetUnassignedPackagesListData = useCallback(
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

  const handleGetRouteListData = useCallback(
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
        GetRouteWithPackagesList({
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          page,
          size: pageSize,
        }).then((res: ShortRouteWithPackagesGridResponse) => {
          const result: RouteShortData[] = res.body.map((x, idx) => {
            return {
              ...x,
              color: ROUTE_COLORS[idx % ROUTE_COLORS.length],
            };
          });
          setRouteListResponse(result);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    handleGetUnassignedPackagesListData({ page: 0, pageSize: -1 });
    handleGetRouteListData({ page: 0, pageSize: -1 }); // TODO: Change request when tabselected changes
  }, [
    selectedWarehouse,
    handleGetRouteListData,
    handleGetUnassignedPackagesListData,
    // tabSelected,
  ]);

  const refreshLocations = () => {
    handleGetUnassignedPackagesListData({ page: 0, pageSize: -1 });
    handleGetRouteListData({ page: 0, pageSize: -1 }); // TODO: Change request when tabselected changes
  };

  const tabComponent = useMemo(() => {
    return (
      <div className="flex flex-col mb-6 gap-3">
        <Label className="text-lg overflow-hidden font-semibold">
          Listado de rutas
        </Label>
        {/* <Tabs defaultValue="created">
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
        </Tabs> */}
      </div>
    );
  }, []);

  return (
    <PageContainer title={"Rutas"}>
      <InteractiveMapSection
        routes={[unassignedPackageLocations, ...routeListResponse]}
        headerNode={tabComponent}
        selectedRouteId={Number(routeId)}
        onSelectLocation={refreshLocations}
      />
    </PageContainer>
  );
};

export default AssignPackagesPage;
