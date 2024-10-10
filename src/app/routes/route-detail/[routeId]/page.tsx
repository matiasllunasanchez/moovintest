"use client";
import PageContainer from "@/components/page-container";
import { useUser } from "@/contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteRouteById,
  GetRouteDetail,
  GetRouteWithPackagesList,
  RemovePackageFromRoute,
  ReorderPackagesOnRoute,
} from "@/app/actions";
import ViewerMapSection from "@/features/routes/maps/viewer-map";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { cn, mapPackagesToMapPackage, ROUTE_COLORS } from "@/lib/utils";
import { Button } from "@/components/custom/button";
import { CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GetIcon } from "@/components/common/icon";
import LocationList from "@/features/new-route/packages-container/location-list";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Modal from "@/components/common/modal";
import { MOOVIN_URLS } from "@/utils/urls";
import { useToast } from "@/components/ui/use-toast";

const RouteDetailPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const color = ROUTE_COLORS[2];
  const { routeId } = useParams();
  const { user, selectedWarehouse } = useUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [route, setRoute] = useState<RouteDetail>();
  const [removePackage, setRemovePackage] = useState<boolean>(false);
  const [routeShortDetail, setRouteShortDetail] = useState<RouteShortData>();
  const [packageLocations, setPackagesLocations] = useState<LocationsGrouping>({
    locations: [],
  });

  const handleGetRouteDetailData = useCallback(
    (routeId: string) => {
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRouteDetail(Number(routeId)).then((res: RouteDetailResponse) => {
          setRoute(res.body);
        });
      }
      if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
        GetRouteWithPackagesList({
          idDelegate: user?.delegate?.idDelegate,
          idWarehouse: selectedWarehouse?.id,
          page: 0,
          size: 10,
          idRouteStatus: -1,
          idRoute: Number(routeId),
        }).then((res) => {
          setRouteShortDetail(res.body[0]);
          const routeDetail = res.body[0];
          const packageLocations: MoovinLocation[] = mapPackagesToMapPackage(
            routeDetail.packages as any[],
            Number(routeId),
            color
          );

          setPackagesLocations({
            idRoute: Number(routeId),
            color: color,
            locations: packageLocations.sort(
              (a: MoovinLocation, b: MoovinLocation) => {
                if (a.order && b.order) {
                  return a.order.localeCompare(b.order);
                }
                return 0;
              }
            ),
          });
        });
      }
    },
    [selectedWarehouse, user?.delegate?.idDelegate]
  );

  useEffect(() => {
    if (removePackage) {
      handleGetRouteDetailData(routeId as string);
      setRemovePackage(false);
    }
  }, [removePackage]);

  useEffect(() => {
    handleGetRouteDetailData(routeId as string); // TODO: Change request when tabselected changes
  }, [selectedWarehouse, handleGetRouteDetailData, routeId]);

  const handleBack = () => {
    router.back();
  };

  const handleLocationReorder = async (updatedLocations: MoovinLocation[]) => {
    const data = {
      idRoute: Number(routeId),
      packages: updatedLocations.map((loc, x) => {
        return { idPackage: loc.id, order: x + 1 };
      }),
    };
    updatedLocations = updatedLocations.map((location, index) => {
      return {
        ...location,
        order: (index + 1).toString(),
      };
    });

    try {
      await ReorderPackagesOnRoute(data).then((res: any) => {
        if (res.httpCode === 200) {
          handleGetRouteDetailData(routeId as string);
          setPackagesLocations((prev) => ({
            ...prev,
            locations: updatedLocations,
          }));
        }
      });
    } catch (error) {
      console.log("Error on reorder packages", error);
      showErrorProcess("Hubo un error al reordenar los paquetes");
    }
  };

  const handleClickDeleteRoute = () => {
    setShowModal(true);
  };

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

  const handleConfirmProcess = async () => {
    try {
      await DeleteRouteById(Number(routeId)).then((res: any) => {
        if (res.httpCode === 200) {
          setShowModal(false);
          showSuccessProcess("Ruta eliminada correctamente");
          setTimeout(() => {
            router.push(MOOVIN_URLS.ROUTES.MAIN);
          }, 3000);
        }
      });
    } catch (error) {
      console.log("Error on route delete", error);
      showErrorProcess("Hubo un error al eliminar la ruta");
    }
  };

  const idArray = packageLocations.locations.map((location) => {
    return {
      packageCode: location.id.toString(),
    };
  });

  const deletePackagesFromRoute = async () => {
    if (routeId && packageLocations) {
      try {
        await RemovePackageFromRoute({
          idRoute: Number(routeId),
          packages: idArray,
        }).then((res: RoutePackageDeletionResponse) => {
          if (res.status == "OK") {
            handleGetRouteDetailData(routeId as string);
            setPackagesLocations({ locations: [] });
            showSuccessProcess(
              "Paquetes desasignados correctamente de la ruta"
            );
          }
        });
      } catch (error) {
        console.log("Error al eliminar los paquetes de la ruta", error);
        showErrorProcess("Hubo un error al desasignar los paquetes de la ruta");
      }
    }
  };

  const tabComponent = (
    <div className="p-[-12px] bg-white">
      <Button
        onClick={() => handleBack()}
        iconName="arrow-back"
        iconClassName="fill-[#64748B] rotate-90  h-[8px]"
        variant={"ghost"}
        className="text-[#64748B]"
      >
        Volver
      </Button>

      <CardContent className="m-4 border border-solid border-slate-300 !rounded-md ">
        {route && (
          <Accordion
            type="single"
            collapsible
            className="w-full flex flex-col !gap-2 mt-2"
            defaultValue={`${route.idRoute}`}
          >
            <AccordionItem
              key={route.idRoute}
              value={`${route.idRoute}`}
              className={cn("   border-none")}
            >
              <AccordionTrigger className="flex justify-between p-2 hover:no-underline  transition-all duration-300 border-none">
                <div className="flex flex-row w-full items-center mr-2">
                  <div
                    className="w-1 rounded-lg h-10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex ml-2 text-black font-medium">
                    {route.nameRoute}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <GetIcon iconName={"package-box"} className="w-4 h-4" />
                    <Label className=" text-nowrap">
                      {routeShortDetail?.numberPackages}
                    </Label>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 ">
                <div className="flex flex-col m-2 p-3 gap-4 bg-slate-50 rounded-lg">
                  <div className="grid items-center w-full grid-cols-2">
                    <div className="flex items-center gap-2">
                      <GetIcon
                        iconName={"package-box"}
                        className="w-3.5 h-3.5"
                        mainColor="#929AB5"
                      />
                      <Label className=" text-nowrap">
                        {routeShortDetail?.numberPackagesDelivery} Envíos
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <GetIcon
                        iconName={"package-box"}
                        className="w-3.5 h-3.5"
                        mainColor="#929AB5"
                      />
                      <Label className=" text-nowrap">
                        {routeShortDetail?.numberPackagesPickup} Recolección
                      </Label>
                    </div>
                  </div>
                  <div className="grid items-center w-full grid-cols-2">
                    <div className="flex items-center gap-2">
                      <GetIcon
                        iconName={"draw-icon"}
                        className="w-4 h-4 "
                        mainColor="#929AB5"
                      />
                      <Label className="text-nowrap">
                        {route.drawer ? route.drawer : "-"} Cajón
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <GetIcon
                        iconName={"truck-icon"}
                        className="w-4 h-4 "
                        mainColor="#929AB5"
                      />
                      <Label className="text-wrap">
                        {routeShortDetail?.mooverName &&
                        routeShortDetail?.mooverName?.length > 1
                          ? routeShortDetail.mooverName
                          : routeShortDetail?.idMoover}
                      </Label>
                    </div>
                  </div>
                </div>
                <LocationList
                  locations={packageLocations.locations}
                  onLocationReorder={handleLocationReorder}
                ></LocationList>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {route?.statusRoute != "end" && route?.statusRoute != "start" && (
          <>
            <Separator className="border-t border-slate-300 w-full"></Separator>

            <div className="flex items-center flex-wrap justify-center mt-4 gap-6">
              <Button variant={"white"} onClick={deletePackagesFromRoute}>
                Eliminar paquetes
              </Button>
              <Button variant={"red"} onClick={handleClickDeleteRoute}>
                Eliminar ruta
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );

  return (
    <PageContainer title={"Rutas"}>
      {route && routeShortDetail && (
        <ViewerMapSection
          route={route}
          locationsGrouping={packageLocations}
          leftColumnComponent={tabComponent}
          setRemovePackage={setRemovePackage}
        />
      )}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
          <div className="flex flex-col  w-[30vw] ">
            <Label className="flex flex-row items-center gap-2 text-lg">
              <GetIcon iconName="bag-icon"></GetIcon>Eliminar ruta
            </Label>
            <Label className="p-6 text-center text-md ">
              Desea eliminar la ruta {route?.nameRoute}?
            </Label>
            <div className="flex flex-row justify-end gap-2">
              <Button
                onClick={() => setShowModal(!showModal)}
                variant={"outline"}
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirmProcess} variant={"red"}>
                Aceptar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default RouteDetailPage;
