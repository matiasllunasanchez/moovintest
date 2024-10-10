export const MOOVIN_URLS = {
  // Reserved for api exposed to the browser urls -> clientFetchService
  API: {
    MAIN: "/",
  },
  // Reserved for BE urls -> serverFetchService
  RESOURCES: { MAIN: "/" },
  // Reserved for intra links in the browser
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  PACKAGES: { MAIN: "/packages", SCAN_PACKAGES: "/packages/scan-packages" },
  ROUTES: {
    MAIN: "/routes",
    NEW: "/routes/new",
    CLOSURE: "/route-closure",
    NEW_ROUTE: "/routes/new-route",
    ASSIGN_PACKAGES: (routeId?: string) => `/routes/${routeId}`,
    DETAIL: (routeId: string) => `/routes/route-detail/${routeId}`,
    HISTORY: "/routes/history",
    CLOSE_ROUTE: (routeId: string) => `/route-closure/${routeId}`,
  },
  ACTIONS: {
    USERINFORMATION: "/user/v1/information",
    MOOVERSBYDELEGATE: (delegateId: number) =>
      `/delegates/moover/v1/list?page=0&size=10&sort=name,asc&idDelegate=${delegateId}`,
    PACKAGESBYDELEGATE: (
      idWarehouse: number,
      idDelegate: number,
      page: number,
      size: number,
      sort: string,
      filters?: string,
      search?: string
    ) => {
      const cleanedInput = search && search.replace(/\s+/g, " ").trim();
      const searchValue = cleanedInput ? `${cleanedInput}` : "";
      const filtersValue = !!filters ? filters : "";
      return `/package/v1/delegate/list?idWarehouse=${idWarehouse}&idDelegate=${idDelegate}&page=${page}&size=${size}&sort=${sort}${filtersValue}&search=${searchValue}`;
    },
    ROUTESBYDELEGATE: (
      idDelegate: number,
      idWarehouse: number,
      page: number,
      size: number,
      sort: string,
      idRouteStatus: number
    ) =>
      `/route/v1/list?idDelegate=${idDelegate}&idWarehouse=${idWarehouse}&idRouteStatus=${idRouteStatus}&page=${page}&size=${size}&sort=${sort}`,
    PACKAGEBYID: (packageId: string) =>
      `/package/v1/information?code=${packageId}`,
    CREATEROUTE: "/route/v1/create",
    UNNASIGNEDPACKAGES: (
      idWarehouse: number,
      idDelegate: number,
      page: number,
      size: number,
      sort: string
    ) =>
      `/package/v2/delegate/list?idWarehouse=${idWarehouse}&idDelegate=${idDelegate}&page=${page}&size=${size}&sort=${sort}`,
    ROUTESWITHPACKAGESLIST: (
      idWarehouse: number,
      idDelegate: number,
      page: number,
      size: number,
      sort: string,
      idRouteStatus: number
    ) =>
      `/route/v1/list/detail?page=${page}&size=${size}&sort=${sort}&idDelegate=${idDelegate}&idWarehouse=${idWarehouse}&idRouteStatus=${idRouteStatus}`,
    ROUTESWITHPACKAGESLISTBYROUTE: (
      idWarehouse: number,
      idDelegate: number,
      page: number,
      size: number,
      sort: string,
      idRoute: number,
      idRouteStatus?: number
    ) =>
      idRouteStatus
        ? `/route/v1/list/detail?page=${page}&size=${size}&sort=${sort}&idDelegate=${idDelegate}&idWarehouse=${idWarehouse}&idRoute=${idRoute}&idRouteStatus=${idRouteStatus}`
        : `/route/v1/list/detail?page=${page}&size=${size}&sort=${sort}&idDelegate=${idDelegate}&idWarehouse=${idWarehouse}&idRoute=${idRoute}`,
    ADDPACKAGETOROUTE: "/route/v1/package/add",
    REMOVE_PACKAGE_FROM_ROUTE: "/route/v1/package/delete",
    ROUTEDETAILBYID: (idRoute: number) =>
      `/route/v1/information?idRoute=${idRoute}`,
    RECIEVEPACKAGES: "/delegate/v1/package/add",
    DELETEROUTE: (routeId: number) => `/route/v1/delete/${routeId}`,
    DASHBOARINFO: (idDelegate: number, idWarehouse: number) =>
      `/delegate/v1/dashboard?idDelegate=${idDelegate}&idWarehouse=${idWarehouse}`,
    RECLAIMPACKAGE: "/package/v1/status",
    UPDATEPACKAGEADRESS: "/package/v1/edit/point",
    PACKAGEINFOFORCLOSEROUTE: (
      idDelegate: number,
      idRoute: number,
      packageCode: number
    ) =>
      `/package/v1/close/check?idDelegate=${idDelegate}&idRoute=${idRoute}&packageCode=${packageCode}`,
    PACKAGERETURNCLOSEROUTE: "/package/v1/close/route",
    CLOSEROUTE: "/route/v1/close",
    PACKAGESIZES: "/catalogs/v1/packages/sizes",
    REORDERPACKAGESONROUTE: "/route/v1/package/reorder",
  },
};
