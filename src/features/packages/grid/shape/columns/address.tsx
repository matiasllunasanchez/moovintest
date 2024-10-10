"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/custom/button";
import { packageSchema } from "../schema";
import dynamic from "next/dynamic";
import { useState } from "react";
import { GetIcon } from "@/components/common/icon";
import { Label } from "@/components/ui/label";
import { GetPackageInfo } from "@/app/actions";
import Modal from "@/components/common/modal";
import useMediaQuery, { desktop } from "@/utils/useMediaQuery";

const DynamicMap = dynamic(() => import("@/components/map"), { ssr: false });

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function AddressColumn<TData>({ row }: DataTableRowActionsProps<TData>) {
  const packageItem = packageSchema.parse(row.original);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [packageLocation, setPackageLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();

  const handleGetPackageInfo = (id: string) => {
    callBack(id);
    // Abrimos el modal
  };

  const callBack = async (id: string) => {
    await GetPackageInfo(id).then((res: any) => {
      setPackageLocation({
        longitude: Number(res.body.destinationPoint.longitude),
        latitude: Number(res.body.destinationPoint.latitude),
      });
      setShowModal(true);
    });
  };
  const isDesktop = useMediaQuery(desktop);
  const heightScreen = isDesktop ? "50vw" : "100%";

  const mapChildren = (
    <div className="flex flex-col gap-4">
      <Label className="flex flex-row items-center gap-2 text-lg">
        <GetIcon iconName="location-icon"></GetIcon>Ubicación
      </Label>
      {packageLocation && (
        <DynamicMap
          selectedLocations={[
            {
              pos: packageLocation,
              id: packageItem.id.toString(),
              selected: false,
              idPackageSize: 0,
              idStatus: 0,
              statusTranslate: "",
              nameStatus: "",
              isCollect: 0,
            },
          ]}
          initialLocation={[
            packageLocation.latitude,
            packageLocation.longitude,
          ]}
          height={"300px"}
          width={heightScreen}
          markCenter
        />
      )}

      <Button
        variant={"white"}
        className="shadow-none w-fit self-end mt-4"
        onClick={() => setShowModal(!showModal)}
      >
        Cerrar
      </Button>
    </div>
  );

  return (
    <div className="flex items-center justify-between">
      <span className="truncate font-medium w-[80%]">
        {row.getValue("address")}
      </span>
      <Button
        iconName="map"
        variant={"white"}
        onClick={() => handleGetPackageInfo(packageItem.id)}
      >
        Ver
      </Button>
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
          {mapChildren}
        </Modal>
      )}
    </div>
  );
}
