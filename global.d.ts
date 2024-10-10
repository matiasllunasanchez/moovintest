type LeafletPosition = [number, number] | { lat: number; lng: number };

// TODO: Add "Map" at the end
type MoovinLocation = {
  pos: LeafLetPosition;
  id: string;
  selected: boolean;
  idRoute?: number;
  color?: string;
  weight?: number;
  address?: string;
  notes?: string;
  acronym?: string;
  order?: string;
  idPackageSize: number;
  idStatus: number;
  statusTranslate: string;
  nameStatus: string;
  isCollect: number;
};

// TODO: Add "Map" at the end
type RouteMovin = {
  idRoute?: number;
  color?: string;
  locations: MoovinLocation[];
};

type LocationsGrouping = {
  idRoute?: number;
  color?: string;
  locations: MoovinLocation[];
};

type IconName =
  | "package-box"
  | "load-packages"
  | "marker"
  | "truck-icon"
  | "close-route-icon"
  | "whatsapp"
  | "reclaim-icon"
  | "location-icon"
  | "bag-icon"
  | "arrow-back"
  | "draw-icon"
  | "drag-icon"
  | "dot-icon"
  | "map"
  | "search-icon"
  | "expand"
  | "contract"
  | "success-icon"
  | "fail-icon";

type IconProps = {
  className?: string;
  bgColor?: string;
  viewBox?: string;
  mainColor?: string;
  strokeWidth?: number;
};

type FetchServiceContext = "PUBLIC" | "PRIVATE";

type InfoQr = {
  idPackage: string;
  fullName?: string;
  phone?: string;
  identification?: string;
};

type MoovinPackage = {
  body: {
    additionalContacts: [
      {
        contactName: string;
        contactPhone: string;
        idContact: number;
        idPoint: number;
        order: number;
      }
    ];
    idPackage: number;
    idReference: string;
    idParent: string | null;
    totalProduct: number | null;
    fullfillment: number;
    clientToDeliver: {
      idClient: number;
      clientName: string | undefined;
      clientImage: null;
      role: string | undefined;
      mail: string | undefined;
      cellPhone: string | undefined;
      fkIdProfile: string | undefined;
      profileName: string | undefined;
    };
    clientSender: {
      clientName: string;
      identification: number | null;
      email: string | undefined;
      phone: string | undefined;
    };
    drawer: number;
    serviceType: string;
    serialNumber: string;
    creditCard: number | null;
    enterpriseCode: string;
    enterpriseCodeSecondary: number | null;
    purchaseDate: date | null;
    acronym: string;
    sendType: string;
    eventDate: date | null;
    weight: number;
    codePrint: string;
    fkIdZone: string | null;
    originPoint: {
      fkIdPointCollect: number;
      isGamCollect: boolean | null;
      addressCollect: string;
      noteCollect: string;
      provinceCollect: string | null;
      cantonCollect: string | null;
      districtCollect: string | null;
      nameContactCollect: string;
      phoneContactCollect: string;
      latitudeCollect: number;
      longitudeCollect: number;
      startCollect: string;
      endCollect: string;
    };
    destinationPoint: {
      idPoint: number;
      isGam: boolean | null;
      address: string | null;
      note: string;
      province: string | null;
      canton: string | null;
      district: string | null;
      nameContact: string;
      phoneContact: string;
      latitude: number;
      longitude: number;
      start: string;
      end: string;
    };

    idDelegate: number;
    idWarehouseOrigin: number;
    idWarehouseOriginName: string;
    idDelegateManifest: number;
    idDelegateBag: number;
    manifestCode: string;
    idDelegateDestination: number;
    delegateDestinationName: string;
    idWarehouseCurrent: number;
    warehouseCurrentName: string;
    bagCode: string;
    codeBag: string;
    idBag: number;
    numberPackages: number;
    createdAt: date;
    createdBy: number;
    createdByName: string;
    updatedAt: date;
    updatedBy: number;
    updatedByName: string;
    status: number;
    weight: number;
    packages: {
      idDelegateBagPackage: number;
      idPackage: number;
      qrCode: null;
      enterpriseCode: string;
      clientName: string;
      weight: number;
      status: number;
    }[];
    latitudeCurrent: number;
    longitudeCurrent: number;
    hasError: number;
    errorMessage: string;
  };
};

type MoovinPackageAccordions = {
  bagCode: string;
  numberPackages: number;
  [];
  rededPackages: MoovinPackage[];
};

type DelegateWarehouse = {
  idWarehouse: number;
  warehouseName: string;
  latitud: number;
  longitud: number;
  status: number;
  isDefault: number;
};

type Moover = {
  idUser: number;
  idDelegate: number;
  delegateCode: string;
  delegateName: string;
  idWarehouse: number;
  warehouseName: string;
  name: string;
  lastName: string;
  commercialName: string;
  birthday: date;
  mail: string;
  imageUrl: string;
  validPhone: number;
  validEmail: number;
  gender: string;
  callPhone: string;
  calificationAverage: number;
  nameAccount: string;
  numberAccountClient: string;
  fkIdMooverAccountType: number;
  status: number;
  registerDate: date;
};

// Grid types
type GridBody = {
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
};

type PackageSizes = {
  id: number;
  acronym: string;
};

// Responses
enum Status {
  Success = "OK",
  Error = "ERROR",
}

type BaseResponse<T> = {
  status: string; // TODO: Change to Status - check
  httpCode: HttpStatusCode;
  message: string;
  body: T;
};

type GridResponse<T> = BaseResponse<{ content: T[] } & GridBody>;
type GridResponseWithoutContent<T> = BaseResponse<T[]>;
type PackageGridResponse = GridResponse<PackageData>;
type ShortPackageGridResponse = GridResponseWithoutContent<PackageShortData>;
type RouteGridResponse = GridResponse<RouteShortData>;
type ShortRouteWithPackagesGridResponse =
  GridResponseWithoutContent<RouteShortData>;
type RouteWithPackagesGridResponse = GridResponse<RouteWithPackages>;
type UserInfoResponse = BaseResponse<UserInfoBody>;
type DashboardInfoResponse = BaseResponse<DashboardItem[]>;
type RouteDetailResponse = BaseResponse<RouteDetail>;
type ReclaimPackageResponse = BaseResponse<>;
type PackageInfoForClosureResponse = BaseResponse<PackageInfoForClosure>;
type PackageSizesResponse = BaseResponse<PackageSizes[]>;

type PackageInfoForClosure = {
  idPackage: number;
  idProfile: number;
  profileName: string;
  idStatusPackage: number;
  statusPackage: string;
  statusTranslate: string;
  listStatus: {
    configureTryCount: {
      maxTryCount: number;
      tryCount: number;
      validTryCount: boolean;
    };
    description: string;
    cancelar: string;
    optionalTryCount: boolean;
    requiredComment: boolean;
    status: string;
    statusTranslate: string;
    idStatus: number;
    hasDetail: boolean;
    statusDetail: {
      id: number;
      name: string;
      description: string;
      commentsRequired: number;
      imageRequired: number;
    }[];
  }[];
  listFailed: [];
  contacts: {
    contactName: string;
    codes: string[];
    callPhone: string;
  };
  [];
  message: string;
  status: string;
};

type PackageInfoForClosureWithStatus = PackageInfoForClosure & {
  newStatus: string;
};

// type RouteData = {
//   id: string;
//   routeName: string;
//   routeDetail: string;
//   status: RouteStatus;
//   deliveredDate: string;
//   mooverName: string;
// };

type RouteShortData = {
  idRoute: number;
  routeName?: string;
  numberPackages?: number;
  numberPackagesCollect?: number;
  idMoover?: number;
  mooverName?: string;
  drawer?: number;
  numberPackagesDelivery?: number;
  numberPackagesPickup?: number;
  packages?: PackageShortData[];
  color?: string;
  routeStatus?: string;
  deliveredDate?: string;
  routeStatusDescription?: string;
  progress?: number;
  numberPackagesCompleted?: number;
  createAt?: string;
};

type RouteWithPackages = {
  idRoute: number;
  idDelegate: number;
  idWarehouse: number;
  routeName: string;
  createAt: string;
  collectDate: string | null;
  deliveredDate: string;
  startDate: string | null;
  endDate: string | null;
  updatedAt: string | null;
  numberPackages: number;
  numberPackagesDelivery: number;
  idMoover: number;
  mooverName: string;
  drawer: number;
  idRouteStatus: number;
  routeStatus: string;
  routeStatusDescription: string;
  packages: PackageShortData[];
};

type PackageRoute = {
  idPackageXRoute: number;
  idPackage: number;
  numberDelivered: number;
  fkIdPoint: number;
  phone: string;
  fullName: string;
  enterpriseCode: string;
  idProfile: number;
  profileName: string;
  statusRoute: string | null;
  statusMoover: string | null;
  currentStatusPackage: string;
  pickup: number;
  exitEstusMoover: number;
  latitude: number;
  longitude: number;
};

type PackageShortData = {
  idPackage: number;
  latitude: number;
  longitude: number;
  address: string;
  notes: string;
  weight: number;
  acronym: string;
  order?: string;
  idPackageSize: number;
  idStatus: number;
  statusTranslate: string;
  nameStatus: string;
  isCollect: number;
};

type PackageData = {
  idPackage: number;
  fullfillment: number;
  idClient: number;
  clientName: string;
  fkIdProfile: number;
  profileName: string;
  serviceType: string;
  address: string;
  identification: string | null;
  fullName: string;
  phone: string;
  enterpriseCode: string;
  enterpriseCodeSecondary: string | null;
  acronym: string;
  sendType: string;
  nameContact: string;
  phoneContact: string;
  idPointCollect: number;
  nameContactCollect: string;
  phoneContactCollect: string;
  isGamCollect: number;
  latitudeCurrent: number;
  longitudeCurrent: number;
  idStatus: number;
  nameStatus: string;
  nameStatusTranslate?: string;
};

type UserDelegateInfo = {
  idUser: number;
  idDelegate: number;
  idDelegateType: number;
  code: string;
  name: string;
  status: string;
  termsVersion: string;
  accepted: number;
  isDefault: number;
};

type UserGeneralInfo = {
  idUser: number;
  name: string;
  lastName: string;
  commercialName: string | null;
  birthday: string | null;
  mail: string;
  registerDate: string;
  callPhone: string;
  calificationAverage: number;
  serviceCount: number;
  imageUrl: string | null;
  fkIdStatus: number;
  gender: string | null;
  mailNotifications: string;
  extensionNumber: string | null;
};

type UserInfoBody = {
  user: UserGeneralInfo;
  delegates: UserDelegateInfo[];
  warehouses: DelegateWarehouse[];
};

type RouteResponse = BaseResponse<Route>;

type RoutePackageDeletionResponse = BaseResponse<ProcessResult>;

type RoutePackageAdditionResponse = BaseResponse<RoutePackageAdditionBody>;

type ProcessResult = {
  status: string;
  message: string;
};

type RoutePackageAdditionBody = {
  idRoute: number;
  packages: { packageCode: string; error: number; message: string }[];
};

type ReclaimCreation = {
  observations: string;
  packageCode: string;
  idWarehouse: string;
  idDelegate: string;
};

type RouteCreation = {
  routeName: string;
  idDelegate: number;
  idWarehouse: number;
  idMoover: number;
  deliveredDate: string;
};

type RoutePackageDeletion = RoutePackageAddition;

type RoutePackageAddition = {
  idRoute: number;
  packages: PackagesToAdd[];
};

type PackagesToAdd = {
  packageCode: string;
};

type Route = RouteCreation & {
  idRoute: number;
};

type RouteDetail = {
  idRoute: number;
  nameRoute: string;
  statusRoute: string;
  delivered: string;
  startDate: string;
  endDate: string;
  collectDate: string;
  payments: {
    totalAmountColon: number;
    totalAmountDollars: number;
    cashColon: number;
    cardColon: number;
    cashDollars: number;
    cardDollars: number;
    unknown: number;
    totalAmountColonSinpeMoovin: number;
    totalAmountColonSinpeCustomer: number;
    paymentsPackages: {
      idPackage: number;
      idRoute: number;
      profileName: string;
      name: string;
      value: null;
      totalAmountColon: number;
      totalAmountDollars: number;
      cashColon: number;
      cardColon: number;
      cashDollars: number;
      cardDollars: number;
      totalAmountColonSinpeMoovin: number;
      totalAmountColonSinpeCustomer: number;
      unknown: number;
    }[];
  };
  supportCenter: {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    gender: string;
    image: string | null;
    email: string;
  };
  moover: {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    calificationAverage: number;
    gender: string;
    image: string | null;
    email: string;
    vehicle: {
      brand: string;
      color: string;
      model: string;
      year: string;
      identity: string;
      type: string;
      icon: string;
    };
    type: string;
    position: string | null;
  };
  drawer: number;
  status: string;
  packages: PackageDetail[];
  resumen: {
    total: number;
    inservice: number;
    faildelivery: number;
    delivered: number;
    collectpickup: number;
    inroute: number;
    inroutepickup: number;
    cancel: number;
    coordinate: number;
    cancelrequest: number;
    inmoovin: number;
    review: number;
    failedpickup: number;
  };
  documents: {
    idDocumentXPackage: number;
    idPackage: number;
    idProfile: number;
    idFieldOfDocument: number;
    name: string;
    description: string;
    profileName: string;
    value: null;
    check: number;
    dateCompleted: date;
  }[];
  pendingPackages: CloseRoutePackageInfo[];
  pendingPackagesCollect: CloseRoutePackageInfo[];
};

type PackageDetail = {
  idPackage: number;
  latitude: number;
  longitude: number;
  numberDelivered: number;
  phone: string;
  enterpriseCode: string;
  name: string;
  status: string;
  statusMoover: string;
  comments: string | null;
  existStatusMoover: boolean;
  callCount: number;
  isPickup: boolean;
  infoAmount: {
    existsAmount: boolean;
    completeAmount: boolean;
  };
  timeStatus: string;
  client: {
    alias: string | null;
    idProfile: number;
    name: string;
  };
  contactsPointDelivery: {
    contacts: [
      {
        contactName: string;
        phone: string;
        codes: string[];
      }
    ];
    status: string;
    message: string;
  };
};

type MoovinPackagesReception = {
  idDelegate: number;
  idWarehouse: number;
  codes: { itemCode: string }[];
};
type MoovinChartItem = {
  key: string;
  value: number;
  fill: string;
};

type DashboardItem = {
  idPackageStatus: number;
  name: string;
  description: string;
  statusTranslate: string;
  packageCount: number;
};

type ReturnPackageCloseRouteReq = {
  idDelegate: number;
  idRoute: number;
  codePackage: number;
  idStatus: number;
  idDetail: string;
  observation?: string;
};

type CloseRouteReq = {
  idRoute: number;
  documents: {
    idDocumentXPackage: number;
    idPackage: number;
    idFieldOfDocument: number;
  }[];
  collectedMoneyRoute: number;
  totalMoneyRoute: number;
};

type CloseRoutePackageInfo = {
  idPackage: string;
  profileName: string;
  status: string;
  statusTranslate: string;
};

type CloseRouteResponse = {
  body: {
    hasError: boolean;
    pendingPackages: CloseRoutePackageInfo[];
    pendingPackagesCollect: CloseRoutePackageInfo[];
    listPackage: number[];
    listStatus: {
      statusTranslate: string;
      name: string;
      idpackageStatus: number;
    }[];

    message: string;
    status: string;
  };
  status: string;
  httpCode: number;
  message: string;
};

type ReorderPackages = {
  idRoute: number;
  packages: {
    idPackage: string;
    order: number;
  }[];
};
