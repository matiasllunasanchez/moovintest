"use client";
import { Button } from "@/components/custom/button";
import PageContainer from "@/components/page-container";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PackagesGrid from "@/features/packages/grid";
import { MOOVIN_URLS } from "@/utils/urls";
import { TabsList } from "@radix-ui/react-tabs";
import Link from "next/link";
import { GetPackagesByDelegate } from "../actions";
import { useCallback, useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";

type TabType = "all-packages" | "route-packages" | "pending-packages";

const PackagesPage = () => {
  const { user, selectedWarehouse } = useUser();
  const [tabSelected, setTabSelected] = useState<TabType>("all-packages");
  const [packagesResponse, setPackageResponse] =
    useState<PackageGridResponse>();
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const packageTabFilters =
    tabSelected === "all-packages"
      ? "&filterType=ALL"
      : tabSelected === "pending-packages"
      ? "&filterType=PENDING"
      : "&filterType=INROUTE";

  const handleGetPackages = useCallback(
    ({
      page,
      pageSize,
      filters,
      searchFilter,
    }: {
      page: number;
      pageSize: number;
      filters?: string;
      searchFilter?: string;
    }) => {
      setIsLoadingData(true);
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetPackagesByDelegate({
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          page,
          size: pageSize,
          filters: filters ?? packageTabFilters,
          search: searchFilter ?? "",
        }).then((res: PackageGridResponse) => {
          // console.log(res, "lista de paquetes");
          setPackageResponse(res);
          setIsLoadingData(false);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate, packageTabFilters]
  );

  useEffect(() => {
    handleGetPackages({ page: 0, pageSize: 10, filters: packageTabFilters });
  }, [tabSelected, selectedWarehouse, handleGetPackages]);

  return (
    <>
      <Dialog>
        <PageContainer title={"Paquetes"}>
          <Tabs defaultValue="all-packages" className="my-2">
            <div>
              <TabsList className="flex flex-col-reverse gap-6 md:flex-row md:justify-between">
                <div className="flex flex-row gap-2 p-2 rounded-md bg-gray justify-evenly">
                  <TabsTrigger
                    value="all-packages"
                    onClick={() => setTabSelected("all-packages")}
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="route-packages"
                    onClick={() => setTabSelected("route-packages")}
                  >
                    Asignados a ruta
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending-packages"
                    onClick={() => setTabSelected("pending-packages")}
                  >
                    Pendientes
                  </TabsTrigger>
                </div>
                <div className="flex flex-row gap-2 justify-between md:justify-end">
                  <Link href={MOOVIN_URLS.PACKAGES.SCAN_PACKAGES}>
                    <Button
                      iconName="load-packages"
                      variant={"white"}
                      className="flex"
                    >
                      Ingresar paquetes
                    </Button>
                  </Link>
                  <Link href={MOOVIN_URLS.ROUTES.NEW_ROUTE}>
                    <Button iconName="truck-icon" variant={"white"}>
                      Crear ruta
                    </Button>
                  </Link>
                </div>
              </TabsList>
            </div>
            <TabsContent value={tabSelected}>
              <PackagesGrid
                gridData={packagesResponse}
                getData={handleGetPackages}
                isLoading={isLoadingData}
              />
            </TabsContent>
          </Tabs>
        </PageContainer>
      </Dialog>
    </>
  );
};

export default PackagesPage;
