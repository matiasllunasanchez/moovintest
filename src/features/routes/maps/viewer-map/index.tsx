"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import dynamic from "next/dynamic";
import { RemovePackageFromRoute } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
type Props = {
  route?: RouteDetail | undefined;
  leftColumnComponent?: ReactNode;
  locationsGrouping: LocationsGrouping;
  setRemovePackage?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ViewerMapSection = ({
  route,
  locationsGrouping,
  leftColumnComponent,
  setRemovePackage,
}: Props) => {
  const { selectedWarehouse } = useUser();
  const { toast } = useToast();

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
    []
  );

  const [initialLocation, setInitialLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (selectedWarehouse?.latitud && selectedWarehouse.longitud) {
      setInitialLocation([
        selectedWarehouse?.latitud,
        selectedWarehouse?.longitud,
      ]);
    }
  }, [selectedWarehouse]);

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

  const handleMarkerClick = useCallback(async (idPackage: number) => {
    if (route?.idRoute) {
      try {
        await RemovePackageFromRoute({
          idRoute: route.idRoute,
          packages: [{ packageCode: idPackage.toString() }],
        }).then((res: RoutePackageDeletionResponse) => {
          if (res.status == "OK") {
            // Mostrar toast ?
            if (res.body.status === "SUCCESS") {
              setRemovePackage && setRemovePackage(true);
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
        showErrorProcess(
          "Hubo un error al querer desasignar el paquete de la ruta"
        );
      }
    }
  }, []);

  const heightScreen = "75vh";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
      <div
        className={`flex flex-col col-span-1 lg:col-span-2 h-[${heightScreen}] min-h-[${heightScreen}] gap-2`}
      >
        <Card className="flex-grow overflow-y-auto rounded-tr-none rounded-br-none ">
          <CardContent className="p-4 h-full">
            {leftColumnComponent}
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-1 lg:col-span-5 min-h-[480px] ">
        <CardContent className="p-0 overflow-hidden !rounded-sm">
          {initialLocation && (
            <RouteMapComp
              handleMarkerClick={handleMarkerClick}
              routes={[locationsGrouping]}
              centerLocation={initialLocation}
              warehouseLocation={initialLocation}
              height={heightScreen}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewerMapSection;
