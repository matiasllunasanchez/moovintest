"use client";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/custom/button";
import Link from "next/link";
import { MOOVIN_URLS } from "@/utils/urls";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import RoutesGrid from "@/features/routes/grid";
import { GetRoutesByDelegate } from "@/app/actions";
import { PaginationState } from "@tanstack/react-table";
import React from "react";

type TabType = "grid" | "map";

const RoutesHistoryPage = () => {
  const { user, selectedWarehouse } = useUser();
  const [gridResponse, setGridResponse] = useState<RouteGridResponse>();
  const [lastPagination, setLastPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const handleGetGridData = useCallback(
    (page?: number, pageSize?: number) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRoutesByDelegate({
          idWarehouse: selectedWarehouse?.id,
          idDelegate: user?.delegate?.idDelegate,
          page,
          size: pageSize,
          idRouteStatus: 3,
        }).then((res: RouteGridResponse) => {
          setGridResponse(res);
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    handleGetGridData();
  }, [selectedWarehouse, handleGetGridData]);

  return (
    <Dialog>
      <PageContainer title={"Histórico de rutas"}>
        <RoutesGrid
          gridData={gridResponse}
          getData={(page: number, pageSize: number) =>
            handleGetGridData(page, pageSize)
          }
        />
      </PageContainer>
    </Dialog>
  );
};

export default RoutesHistoryPage;
