"use client";
import PageContainer from "@/components/page-container";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import {
  GetMooversByDelegate,
  GetPackageSizes,
  GetUnassignedPackages,
  GetUnassignedPackagesExtended,
} from "@/app/actions";
import ViewerMapSection from "@/features/routes/maps/viewer-map";
import NewRouteCreationContainer from "@/features/new-route/creation";
import { MOOVIN_URLS } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { mapPackagesToMapPackage } from "@/lib/utils";

const NewRoutePage = () => {
  const router = useRouter();
  const { user, selectedWarehouse } = useUser();
  const [createdRoute, setCreatedRoute] = useState<Route>();
  const [moovers, setMoovers] = useState<Moover[]>();
  const [packageLocations, setPackagesLocations] = useState<LocationsGrouping>({
    locations: [],
    idRoute: -1,
    color: "#636363",
  });

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
        GetUnassignedPackages({
          idDelegate: user.delegate.idDelegate,
          idWarehouse: selectedWarehouse.id,
        }).then((res: ShortPackageGridResponse) => {
          const currentPackages: MoovinLocation[] = mapPackagesToMapPackage(
            res.body,
            -1,
            "#636363"
          );

          setPackagesLocations({
            ...packageLocations,
            locations: currentPackages,
          });
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    if (createdRoute && createdRoute.idRoute) {
      router.push(MOOVIN_URLS.ROUTES.MAIN);
    }
  }, [createdRoute, router]);

  useEffect(() => {
    if (user?.delegate != undefined) {
      GetMooversByDelegate(user.delegate.idDelegate).then((res: any) =>
        setMoovers(res.body.content)
      );
    }
  }, [user?.delegate]);

  useEffect(() => {
    handleGetRouteListData({ page: 0, pageSize: 10 }); // TODO: Change request when tabselected changes
  }, [selectedWarehouse, handleGetRouteListData]);

  const tabComponent = (
    <NewRouteCreationContainer
      moovers={moovers}
      setRoute={(createdRoute) => setCreatedRoute(createdRoute)}
    />
  );

  return (
    <PageContainer title={"Rutas"}>
      <ViewerMapSection
        locationsGrouping={packageLocations}
        leftColumnComponent={tabComponent}
      />
    </PageContainer>
  );
};

export default NewRoutePage;
