"use server";

import { serverFetchService } from "@/services/fetch";
import { MOOVIN_URLS } from "@/utils/urls";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/authoptions";

type GridRequestParams = {
  idWarehouse: number;
  idDelegate: number;
  page?: number;
  size?: number;
  sort?: string;
  idRouteStatus?: number;
  idRoute?: number;
  filters?: string;
  search?: string;
};

type GridRoutesFilter = {
  idWarehouse: number;
  idDelegate: number;
  page?: number;
  size?: number;
  sort?: string;
};

export async function GetUserInfo(): Promise<UserInfoResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.USERINFORMATION, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Accept-Language": "es",
    },
  });
}

export async function GetMooversByDelegate(delegateId: number) {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.MOOVERSBYDELEGATE(delegateId),

    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function GetPackagesByDelegate({
  idWarehouse,
  idDelegate,
  page = 0,
  size = 10,
  sort = "idPackage,desc",
  filters = "",
  search = "",
}: GridRequestParams): Promise<PackageGridResponse> {
  const session = await getServerSession(authOptions);
  const resultUrl = MOOVIN_URLS.ACTIONS.PACKAGESBYDELEGATE(
    idWarehouse,
    idDelegate,
    page,
    size,
    sort,
    filters,
    search
  );
  return await serverFetchService(resultUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Accept-Language": "es",
    },
  });
}

export async function GetRoutesByDelegate({
  idDelegate,
  page = 0,
  size = 10,
  idRouteStatus = 1,
  idWarehouse,
  sort = "idRoute,asc",
}: GridRequestParams): Promise<RouteGridResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.ROUTESBYDELEGATE(
      idDelegate,
      idWarehouse,
      page,
      size,
      sort,
      idRouteStatus
    ),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function GetPackageInfo(packageId: string) {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.PACKAGEBYID(packageId), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Accept-Language": "es",
    },
  });
}

export async function CreateRoute(
  route: RouteCreation
): Promise<RouteResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.CREATEROUTE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(route),
  });
}

export async function GetUnassignedPackages({
  idDelegate,
  idWarehouse,
  page = 0,
  size = -1,
  sort = "idPackage,desc",
}: GridRequestParams): Promise<ShortPackageGridResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.UNNASIGNEDPACKAGES(
      idWarehouse,
      idDelegate,
      page,
      -1, // FORCE TO GET ALL
      sort
    ),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}
export async function GetUnassignedPackagesExtended({
  idDelegate,
  idWarehouse,
  page = 0,
  size = 0, //do not use -1 on this endpoint
  sort = "idPackage,desc",
}: GridRequestParams): Promise<PackageGridResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.UNNASIGNEDPACKAGES(
      idWarehouse,
      idDelegate,
      page,
      size,
      sort
    ),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function GetRouteWithPackagesList({
  idDelegate,
  idWarehouse,
  page = 0,
  size = -1,
  sort = "idRoute,asc",
  idRouteStatus = 1,
  idRoute,
}: GridRequestParams): Promise<ShortRouteWithPackagesGridResponse> {
  const session = await getServerSession(authOptions);
  if (idRoute) {
    return await serverFetchService(
      MOOVIN_URLS.ACTIONS.ROUTESWITHPACKAGESLISTBYROUTE(
        idWarehouse,
        idDelegate,
        page,
        -1, // FORCE TO GET ALL
        sort,
        idRoute,
        idRouteStatus == -1 ? undefined : idRouteStatus
      ),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          cache: "no-store",
          "Accept-Language": "es",
        },
      }
    );
  } else {
    return await serverFetchService(
      MOOVIN_URLS.ACTIONS.ROUTESWITHPACKAGESLIST(
        idWarehouse,
        idDelegate,
        page,
        -1, // FORCE TO GET ALL
        sort,
        idRouteStatus
      ),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          cache: "no-store",
          "Accept-Language": "es",
        },
      }
    );
  }
}
export async function GetRouteWithPackagesListExtended({
  idDelegate,
  idWarehouse,
  page = 0,
  size = 0, //do not use -1 on this endpoint
  sort = "idRoute,asc",
  idRouteStatus = 1,
}: GridRequestParams): Promise<RouteWithPackagesGridResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.ROUTESWITHPACKAGESLIST(
      idWarehouse,
      idDelegate,
      page,
      size,
      sort,
      idRouteStatus
    ),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function AddPackageToRoute(
  route: RoutePackageAddition
): Promise<RoutePackageAdditionResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.ADDPACKAGETOROUTE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(route),
  });
}

export async function RemovePackageFromRoute(
  route: RoutePackageDeletion
): Promise<RoutePackageDeletionResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.REMOVE_PACKAGE_FROM_ROUTE,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        "Accept-Language": "es",
      },
      body: JSON.stringify(route),
    }
  );
}

export async function GetRouteDetail(
  idRoute: number
): Promise<RouteDetailResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.ROUTEDETAILBYID(idRoute),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function ReceivePackages(data: MoovinPackagesReception) {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.RECIEVEPACKAGES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(data),
  });
}

export async function GetDashboardInfo(
  idDelegate: number,
  idWarehouse: number
): Promise<DashboardInfoResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.DASHBOARINFO(idDelegate, idWarehouse),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function DeleteRouteById(idRoute: number) {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.DELETEROUTE(idRoute), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Accept-Language": "es",
    },
  });
}

export async function ReclaimPackage(
  reclaim: ReclaimCreation
): ReclaimPackageResponse {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.RECLAIMPACKAGE, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(reclaim),
  });
}

export async function EditPackageAddress(data: any) {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.UPDATEPACKAGEADRESS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(data),
  });
}

export async function GetPackageInfoCloseRoute(
  delegateId: number,
  routeId: number,
  packageId: number
): Promise<PackageInfoForClosureResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(
    MOOVIN_URLS.ACTIONS.PACKAGEINFOFORCLOSEROUTE(
      delegateId,
      routeId,
      packageId
    ),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Accept-Language": "es",
      },
    }
  );
}

export async function ReturnPackageCloseRoute(
  data: ReturnPackageCloseRouteReq
) {
  const session = await getServerSession(authOptions);
  console.log(data, "esta es la data");
  return await serverFetchService(MOOVIN_URLS.ACTIONS.PACKAGERETURNCLOSEROUTE, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(data),
  });
}

export async function CloseRoute(
  data: CloseRouteReq
): Promise<CloseRouteResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.CLOSEROUTE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(data),
  });
}

export async function GetPackageSizes(): Promise<PackageSizesResponse> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.PACKAGESIZES, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Accept-Language": "es",
    },
  });
}

export async function ReorderPackagesOnRoute(
  data: ReorderPackages
): Promise<any> {
  const session = await getServerSession(authOptions);
  return await serverFetchService(MOOVIN_URLS.ACTIONS.REORDERPACKAGESONROUTE, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "es",
    },
    body: JSON.stringify(data),
  });
}
