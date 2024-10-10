"use client";
import { GetRoutesByDelegate } from "@/app/actions";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import RoutesClosureGrid from "./grid";

const RouteClosureContainer = () => {
  const { user, selectedWarehouse } = useUser();
  const [routes, setRoutes] = useState<RouteGridResponse>();

  const handleGetActiveRoutes = useCallback(
    (page?: number, size?: number) => {
      if (user?.delegate && selectedWarehouse) {
        GetRoutesByDelegate({
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          page: page,
          size: size,
          idRouteStatus: 4,
        }).then((res: RouteGridResponse) => {
          setRoutes(res);
        });
      }
    },
    [selectedWarehouse]
  );

  useEffect(() => {
    handleGetActiveRoutes();
  }, [, selectedWarehouse]);

  return (
    <>
      <RoutesClosureGrid
        gridData={routes}
        getData={(page: number, pageSize: number) =>
          handleGetActiveRoutes(page, pageSize)
        }
      />
    </>
  );
};

export default RouteClosureContainer;
