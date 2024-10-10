import { GetIcon } from "@/components/common/icon";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/custom/button";
import { cn } from "@/lib/utils";
import { MOOVIN_URLS } from "@/utils/urls";
import Link from "next/link";
import { useState } from "react";
import Modal from "@/components/common/modal";
import { DeleteRouteById } from "@/app/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  routes?: RouteShortData[];
  handleSelectRoute?: (idRoute: number) => void;
  selectedRouteId?: number;
  setDeleteRoute?: React.Dispatch<React.SetStateAction<boolean>>;
};

const RouteListAccordion = ({
  routes,
  handleSelectRoute,
  selectedRouteId,
  setDeleteRoute,
}: Props) => {
  const hasLocations = routes && routes.length > 0;
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleSelection = (id: number) => {
    if (handleSelectRoute) handleSelectRoute(id);
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
  const handleConfirmProcess = async (routeId: number) => {
    try {
      await DeleteRouteById(Number(routeId)).then((res: any) => {
        if (res.httpCode === 200) {
          setShowModal(false);
          showSuccessProcess("Ruta eliminada correctamente");
          setTimeout(() => {
            setDeleteRoute && setDeleteRoute(true);
          }, 3000);
        } else {
          console.log("Error on route delete", res.message);
          showErrorProcess(
            "Hubo un error al eliminar la ruta - " + res.message
          );
          setShowModal(false);
        }
      });
    } catch (error) {
      console.log("Error on route delete", error);
      showErrorProcess("Hubo un error al eliminar la ruta");
    }
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col !gap-2"
      >
        {hasLocations ? (
          routes.map((route, idx) => (
            <AccordionItem
              key={route.idRoute}
              value={`${route.idRoute}`}
              className={cn(
                "!rounded-md border border-solid border-slate-300 px-2",
                !!(selectedRouteId === route.idRoute) &&
                  "border-blue-600 border-2"
              )}
              onClick={() => route.idRoute && handleSelection(route.idRoute)}
            >
              <AccordionTrigger className="flex justify-between p-2 hover:no-underline hover:bg-slate-100 transition-all duration-300">
                <div className="flex flex-row w-full items-center mr-2">
                  <div
                    className="w-1 rounded-lg h-10"
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="flex ml-2 text-black font-medium">
                    {route.routeName}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <GetIcon iconName={"package-box"} className="w-4 h-4" />
                    <Label className=" text-nowrap">
                      {route.numberPackages}
                    </Label>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <div className="flex flex-col m-2 p-3 gap-4 bg-slate-50 rounded-lg">
                  <div className="grid items-center w-full grid-cols-2">
                    <div className="flex items-center gap-2">
                      <GetIcon
                        iconName={"package-box"}
                        className="w-3.5 h-3.5"
                        mainColor="#929AB5"
                      />
                      <Label className=" text-nowrap">
                        {route.numberPackagesDelivery} Envíos
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <GetIcon
                        iconName={"package-box"}
                        className="w-3.5 h-3.5"
                        mainColor="#929AB5"
                      />
                      <Label className=" text-nowrap">
                        {route.numberPackagesPickup} Recolección
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
                        className="w-4 h-4"
                        mainColor="#929AB5"
                      />
                      <Label className="text-nowrap">
                        {route.deliveredDate
                          ? route.deliveredDate.split("-")[2] +
                            "-" +
                            route.deliveredDate.split("-")[1] +
                            "-" +
                            route.deliveredDate.split("-")[0]
                          : "-"}
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GetIcon
                      iconName={"truck-icon"}
                      className="w-4 h-4"
                      mainColor="#929AB5"
                    />
                    <Label className="text-nowrap">
                      {route.mooverName && route.mooverName?.length > 1
                        ? route.mooverName
                        : route.idMoover}
                    </Label>
                  </div>
                </div>
                {route && route.packages && route.packages?.length > 0 ? (
                  <Link
                    href={MOOVIN_URLS.ROUTES.DETAIL(
                      route.idRoute ? route.idRoute.toString() : ""
                    )}
                  >
                    <Button
                      variant="ghost"
                      className="w-full text-slate-500 underline"
                    >
                      Ver detalle de paquetes
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="red"
                    className="w-full text-slate-500 underline"
                    onClick={handleClickDeleteRoute}
                  >
                    Borrar ruta
                  </Button>
                )}
                {showModal && (
                  <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(!showModal)}
                  >
                    <div className="flex flex-col  w-[30vw] ">
                      <Label className="flex flex-row items-center gap-2 text-lg">
                        <GetIcon iconName="bag-icon"></GetIcon>Eliminar ruta
                      </Label>
                      <Label className="p-6 text-center text-md ">
                        Desea eliminar la ruta {route?.routeName}?
                      </Label>
                      <div className="flex flex-row justify-end gap-2">
                        <Button
                          onClick={() => setShowModal(!showModal)}
                          variant={"outline"}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleConfirmProcess(route.idRoute)}
                          variant={"red"}
                        >
                          Aceptar
                        </Button>
                      </div>
                    </div>
                  </Modal>
                )}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div>
            <Label className="italic">
              No se han encontrado rutas para mostrar
            </Label>
          </div>
        )}
      </Accordion>
    </>
  );
};

export default RouteListAccordion;
