import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateMockLocations = (
  routes: RouteShortData[],
  center: [number, number],
  count: number,
  selectedRouteId?: number
): RouteMovin[] => {
  const generateLocations = ({
    idRoute,
    color,
    selectedRouteId,
  }: {
    idRoute?: number;
    color?: string;
    selectedRouteId?: number;
  }) => {
    const locations: MoovinLocation[] = [];
    for (let i = 0; i < count; i++) {
      const randomLat = center[0] + (Math.random() - 0.5) * 0.05;
      const randomLong = center[1] + (Math.random() - 0.5) * 0.05;
      locations.push({
        pos: [randomLat, randomLong],
        id: `${i + 1}`,
        selected: false,
        idRoute: idRoute,
        color: color,
        idPackageSize: 1,
        idStatus: 1,
        statusTranslate: "",
        nameStatus: "",
        isCollect: 0,
      });
    }
    return locations;
  };

  const newRoutes: RouteMovin[] = routes.map((x) => {
    return {
      idRoute: x.idRoute,
      color: x.color,
      locations:
        x.idRoute === selectedRouteId
          ? []
          : generateLocations({
              idRoute: x.idRoute ?? undefined,
              color: x.color ?? "#ffff",
            }),
    };
  });
  return newRoutes;
};

export const mapRoutesToMapRoute = (routes: RouteShortData[]): RouteMovin[] => {
  const result = routes.map((x: RouteShortData) => {
    return {
      idRoute: x.idRoute,
      color: x.color,
      locations: mapPackagesToMapPackage(x.packages, x.idRoute, x.color),
    };
  }) as RouteMovin[];
  return result;
};

export const mapPackagesToMapPackage = (
  packages?: PackageShortData[],
  idRoute?: number,
  color?: string
): MoovinLocation[] => {
  if (!packages) return [];

  return packages.map((p) => {
    return {
      pos: [p.latitude, p.longitude],
      id: `${p.idPackage}`, // TODO: Check if this need to be changed string to number)
      selected: false,
      idRoute: idRoute,
      color: color,
      weight: p.weight,
      address: p.address,
      notes: p.notes,
      acronym: p.acronym,
      order: p.order,
      idPackageSize: p.idPackageSize,
      idStatus: p.idStatus,
      isCollect: p.isCollect,
      nameStatus: p.nameStatus,
      statusTranslate: p.statusTranslate,
    };
  });
};

export const mapUnassignedPackagesToShortPackage = (
  packages?: any[]
): any[] => {
  if (!packages) return [];

  return packages.map((p) => {
    return {
      latitude: p.latitudeCurrent,
      longitude: p.longitudeCurrent,
      idPackage: p.idPackage,
    };
  });
};
export const ROUTE_COLORS = [
  "#ADD8E6",
  "#FF0000",
  "#008080",
  "#FFB6C1",
  "#FFD700",
  "#9370DB",
  "#40E0D0",
  "#FF8C00",
  "#808000",
  "#F5F5DC",
];

/*export const ROUTE_COLORS = [
  "#9747FF",
  "#AB2F2B",
  "#4CAB2B",
  "#D97706",
  "#2B3FAB",
  "#2BABAB",
  "#BA58B0",
];
*/
export function decodeQr(input: string): InfoQr {
  const result: InfoQr = { idPackage: "" };
  const parts = input.split("||");

  parts.forEach((part) => {
    const [key, value] = part.split("<MN>");
    if (key && value !== undefined) {
      switch (key) {
        case "idPackage":
          result.idPackage = value;
          break;
        case "fullName":
          result.fullName = value;
          break;
        case "phone":
          result.phone = value;
          break;
        case "identification":
          result.identification = value !== "null" ? value : undefined;
          break;
        default:
          break;
      }
    }
  });

  return result;
}

export function SeparatePackageData(
  qrToProcess: MoovinPackage[]
): MoovinPackageAccordions[] {
  const groupedPackages: { [key: string]: MoovinPackageAccordions } = {};

  qrToProcess.forEach((qr) => {
    const { codeBag, idPackage } = qr.body;

    if (codeBag && idPackage) {
      if (!groupedPackages[codeBag]) {
        groupedPackages[codeBag] = {
          bagCode: codeBag,
          numberPackages: 0,
          rededPackages: [],
        };
      }
      groupedPackages[codeBag].rededPackages.push(qr);
      groupedPackages[codeBag].numberPackages += 1;
    } else {
      const defaultKey = "0";
      if (!groupedPackages[defaultKey]) {
        groupedPackages[defaultKey] = {
          bagCode: "0",
          numberPackages: 0,
          rededPackages: [],
        };
      }
      groupedPackages[defaultKey].rededPackages.push(qr);
    }
  });

  return Object.values(groupedPackages);
}
