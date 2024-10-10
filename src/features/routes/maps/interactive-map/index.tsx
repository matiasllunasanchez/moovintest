"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import dynamic from "next/dynamic";
import RouteListAccordion from "./route-list-accordion";
import { mapRoutesToMapRoute } from "@/lib/utils";
import { AddPackageToRoute, RemovePackageFromRoute } from "@/app/actions";
import LoadingBox from "@/components/loading-box";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "@radix-ui/react-dialog";
import SwitchRoutePackageModal from "./switch-route-package-modal";
import { time } from "console";

type Props = {
  selectedRouteId?: number;
  routes: RouteShortData[];
  headerNode?: ReactNode;
  onSelectLocation?: () => void;

  setDeleteRoute?: React.Dispatch<React.SetStateAction<boolean>>;
};

type PackageProcess = { message: string; processing: boolean };

const InteractiveMapSection = ({
  routes,
  headerNode,
  selectedRouteId,
  onSelectLocation,
  setDeleteRoute,
}: Props) => {
  const { toast } = useToast();
  const { selectedWarehouse } = useUser();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showSelectRouteFirstToast = () => {
    toast({
      variant: "destructive",
      title: "Ruta no seleccionada",
      description:
        "Seleccione una ruta del listado para poder asignar ó desasignar paquetes a la misma",
    });
  };

  // TODO: Check not working
  const showSuccessProcess = (text: string) => {
    toast({
      variant: "default",
      title: "Acción realizada",
      description: text,
    });
  };

  const showErrorProcess = (text: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: text,
    });
  };

  const RouteMapComp = useMemo(
    () =>
      dynamic(() => import("@/features/routes/maps/route-map"), {
        loading: () => (
          <div className="flex flex-col items-center justify-center">
            <div className="mt-40">The map is loading</div>
          </div>
        ),
        ssr: false,
      }),
    [selectedWarehouse]
  );

  const [initialLocation, setInitialLocation] = useState<
    [number, number] | null
  >(null);

  const [centerLocation, setCenterLocation] = useState<[number, number] | null>(
    null
  );

  const [routeListData, setRouteListData] = useState<RouteMovin[]>([]);

  const [selectedRoute, setSelectedRoute] = useState<RouteMovin | null>(null);

  const [isProcessingPackage, setProcessingPackage] = useState<PackageProcess>({
    message: "",
    processing: false,
  });

  const [packageToReassign, setPackageToReassign] = useState<{
    idPackage: number;
    idRoute: number;
  } | null>();

  const startPackageProcessing = (text: string) => {
    setProcessingPackage({
      processing: true,
      message: text,
    });
  };

  const finishPackageProcessing = () => {
    setProcessingPackage({
      processing: false,
      message: "",
    });
  };

  const [showReallocationModal, setShowReallocationModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (selectedWarehouse?.latitud && selectedWarehouse.longitud) {
      console.log("Warehouse has changed");
      setInitialLocation([
        selectedWarehouse?.latitud,
        selectedWarehouse?.longitud,
      ]);
    }
  }, [selectedWarehouse]);

  useEffect(() => {
    if (selectedRouteId && routeListData.length > 0 && !selectedRoute) {
      const existingRoute = routeListData.find(
        (x) => x.idRoute === selectedRouteId
      );

      if (existingRoute) {
        setSelectedRoute(existingRoute);

        // Si la ruta tiene locations, centrarse en la primera ubicación
        if (existingRoute.locations.length > 0) {
          setCenterLocation(existingRoute.locations[0].pos);
        } else {
          // Si no tiene locations, centrarse en la ubicación inicial o almacén seleccionado
          if (selectedWarehouse)
            setCenterLocation([
              selectedWarehouse?.latitud,
              selectedWarehouse?.longitud,
            ]);
        }
      }
    }
  }, [selectedRouteId, routeListData, selectedWarehouse]);

  useEffect(() => {
    // Manejo de carga de puntos de ruta en mapa0
    if (!!initialLocation) {
      const mapedRoutes: RouteMovin[] = mapRoutesToMapRoute(routes);
      setRouteListData(mapedRoutes);
    }
  }, [initialLocation, routeListData.length, routes, selectedRouteId]);

  const handleMarkerClick = useCallback(
    async (idPackage: number, idRoute?: number | undefined) => {
      if (!selectedRoute || !selectedRoute.idRoute) {
        // Si no hay una ruta seleccionada, no hacer nada
        showSelectRouteFirstToast();
        return;
      }

      // Proceso de asignar/desaignar paquete de ruta y forzar el refresh de la data

      if (!idRoute || (idRoute < 0 && selectedRoute)) {
        // Agrego paquete desasignado
        startPackageProcessing("Agregando paquete a ruta");

        try {
          await AddPackageToRoute({
            idRoute: selectedRoute.idRoute,
            packages: [{ packageCode: idPackage.toString() }],
          }).then((res: RoutePackageAdditionResponse) => {
            if (res.status == "OK") {
              // Mostrar toast ?
              setDeleteRoute && setDeleteRoute(true);
              showSuccessProcess(
                "El paquete ha sido asignado correctamente a la ruta actual"
              );
            } else {
              showErrorProcess(res.message);
            }
          });
        } catch (error) {
          console.log("Error on package addition on route", error);
          showErrorProcess(
            "Hubo un error al querer asignar el paquete a la ruta"
          );
        }
        if (onSelectLocation) onSelectLocation();
      } else if (idRoute > 0) {
        // Paquete ya tenia ruta existente
        if (idRoute === selectedRoute.idRoute) {
          // Mismo punto de misma ruta, implica deseleccion / desasignacion. Elimino.
          startPackageProcessing("Quitando paquete de ruta");

          try {
            await RemovePackageFromRoute({
              idRoute: selectedRoute.idRoute,
              packages: [{ packageCode: idPackage.toString() }],
            }).then((res: RoutePackageDeletionResponse) => {
              if (res.status == "OK") {
                // Mostrar toast ?
                if (res.body.status === "SUCCESS") {
                  setDeleteRoute && setDeleteRoute(true);
                  showSuccessProcess(
                    "El paquete ha sido desasignado correctamente de la ruta actual"
                  );
                } else {
                  showErrorProcess(res.body.message);
                }
              } else {
                showErrorProcess(res.message);
              }
            });
          } catch (error) {
            console.log("Error on package addition on route", error);
            showErrorProcess(
              "Hubo un error al querer desasignar el paquete de la ruta"
            );
          }
          if (onSelectLocation) onSelectLocation();
        } else {
          // Implica switcheo de puntos, agregar la localizacion indicada a la ruta seleccionada.
          setShowReallocationModal(true);
          setPackageToReassign({
            idPackage,
            idRoute,
          });
        }
      }
    },
    [routeListData, selectedRoute]
  );

  const handleMultipleMarkerSelection = useCallback(
    async (packages: { idPackage: number; idRoute?: number | undefined }[]) => {
      // console.log("Multiple packages selection", packages);
      if (!selectedRoute) {
        // Si no hay una ruta seleccionada, no hacer nada
        showSelectRouteFirstToast();
        return;
      } else {
        const assignPackages = packages.reduce((acc, pkg) => {
          if (pkg.idRoute === -1) {
            acc.push({ packageCode: pkg.idPackage.toString() });
          }
          return acc;
        }, [] as { packageCode: string }[]);

        if (assignPackages.length > 0) {
          // Agrego paquete desasignado
          startPackageProcessing("Agregando paquete a ruta");
          try {
            await AddPackageToRoute({
              idRoute: selectedRoute.idRoute || 0,
              packages: assignPackages,
            }).then((res: RoutePackageAdditionResponse) => {
              if (res.status == "OK") {
                // Mostrar toast ?
                showSuccessProcess(
                  "Se han agregado " +
                    assignPackages.length +
                    " paquetes a la ruta actual"
                );
              }
            });
          } catch (error) {
            console.log("Error on package addition on route", error);
            showErrorProcess(
              "Hubo un error al querer asignar el paquete a la ruta"
            );
          }
          if (onSelectLocation) onSelectLocation();
        }
      }

      // TODO: Proceso de asignar/desaignar paqueteS de ruta con lazo y forzar el refresh de la data
      if (onSelectLocation) onSelectLocation();
    },
    [routeListData, selectedRoute]
  );

  const handleRouteOnClick = useCallback(
    (id: number) => {
      // console.log("Click on Route", id);
      if (selectedWarehouse) {
        const route = routeListData.find((X) => X.idRoute === id) ?? null;

        if (route) {
          setSelectedRoute(route);
          // Solo actualizar `centerLocation` si la ruta tiene ubicaciones
          if (route.locations.length > 0) {
            setCenterLocation(route.locations[0].pos);
          }
        }
      }
    },
    [routeListData, selectedWarehouse]
  );

  const handleReallocationPackages = useCallback(async () => {
    if (!packageToReassign) return;

    if (!selectedRoute || !selectedRoute.idRoute) {
      showSelectRouteFirstToast();
      return;
    }

    startPackageProcessing("Asignando paquete a ruta");

    const { idRoute, idPackage } = packageToReassign;

    // TODO: BORRAR CUANDO ARREGLEN EL BACKEND. EL BLOQUE ENTERO DE REMOVE.
    try {
      await RemovePackageFromRoute({
        idRoute: idRoute,
        packages: [{ packageCode: idPackage.toString() }],
      }).then((res: RoutePackageDeletionResponse) => {
        if (res.status == "OK") {
          // Mostrar toast ?
        }
      });
    } catch (error) {
      console.log("Error on package addition on route", error);
      showErrorProcess("Hubo al intentar remover el paquete de la ruta");
      return;
    }

    try {
      await AddPackageToRoute({
        idRoute: selectedRoute.idRoute,
        packages: [{ packageCode: idPackage.toString() }],
      }).then((res: RoutePackageAdditionResponse) => {
        if (res.status == "OK") {
          // Mostrar toast ?
          showSuccessProcess(
            "El paquete ha sido reasignado correctamente a otra ruta"
          );
        }
      });
    } catch (error) {
      console.log("Error on package addition on route", error);
      showErrorProcess("Hubo un error al asignar el paquete a la ruta");
      return;
    }
    if (onSelectLocation) onSelectLocation();
    setShowReallocationModal(false);
  }, [packageToReassign, selectedRoute, showSelectRouteFirstToast]);

  useEffect(() => {
    if (isProcessingPackage.processing && routeListData.length > 0) {
      finishPackageProcessing();
    }
  }, [routeListData]);

  const heightScreen = "75vh";
  const currentRoute = routes.filter((x) => x.idRoute === selectedRouteId);
  const restRoutes = routes.filter(
    (x) => x.idRoute !== selectedRouteId && x.idRoute && x.idRoute > 0
  );
  return (
    <>
      <Dialog
        open={showReallocationModal}
        onOpenChange={setShowReallocationModal}
      >
        <div className="grid grid-cols-1 lg:grid-cols-7 h-[75vh]">
          <div
            className={`flex flex-col col-span-1 lg:col-span-2 h-[${heightScreen}] min-h-[${heightScreen}] gap-2`}
          >
            <Card className="flex-grow overflow-y-auto rounded-tr-none rounded-br-none bg-zinc-50">
              <CardContent className="p-4">
                {headerNode}
                <RouteListAccordion
                  routes={[...currentRoute, ...restRoutes]}
                  selectedRouteId={selectedRoute?.idRoute}
                  handleSelectRoute={handleRouteOnClick}
                  setDeleteRoute={setDeleteRoute}
                />
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-1 lg:col-span-5 min-h-[480px] relative">
            {isProcessingPackage.processing && (
              <div className="absolute z-40 w-full h-full top-0 left-0 bg-white/85 flex flex-col items-center justify-center">
                <LoadingBox text={isProcessingPackage.message} hideLogo />
              </div>
            )}
            <CardContent className="p-0 overflow-hidden !rounded-sm">
              {initialLocation && routeListData && routeListData.length > 0 && (
                <RouteMapComp
                  selectedRoute={selectedRoute?.idRoute}
                  routes={routeListData}
                  centerLocation={centerLocation ?? initialLocation}
                  warehouseLocation={initialLocation}
                  height={heightScreen}
                  handleMarkerClick={handleMarkerClick}
                  handleMarkerSelectionArea={handleMultipleMarkerSelection}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <SwitchRoutePackageModal
          onClose={() => {
            setShowReallocationModal(false);
          }}
          onConfirm={handleReallocationPackages}
        />
      </Dialog>
    </>
  );
};

export default InteractiveMapSection;
