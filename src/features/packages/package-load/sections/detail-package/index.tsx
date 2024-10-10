"use client";
import React, { useState } from "react";

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/custom/button";

import { Label } from "@/components/ui/label";
import WhatsAppContactButton from "@/components/common/whatsapp-button";
import SectionModal from "@/features/packages/grid/detail-modal/section";
import { InfoItem } from "@/features/packages/grid/detail-modal/section/info-item";
import Modal from "@/components/common/modal";
import ReportPackage from "../report-package";
import { GetIcon } from "@/components/common/icon";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
import { EditPackageAddress } from "@/app/actions";
import useMediaQuery, { desktop } from "@/utils/useMediaQuery";

type Props = {
  data: MoovinPackage; // Todo: Change when response types are ready
};

const Map = dynamic(() => import("@/components/map"), { ssr: false });
const ScanDetailModal = ({ data }: Props) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number]>([
    data.body.latitudeCurrent,
    data.body.longitudeCurrent,
  ]);
  const isDesktop = useMediaQuery(desktop);
  const heightScreen = isDesktop ? "50vw" : "100%";

  const latitudeData = position[0] ? position[0] : data.body.latitudeCurrent;

  const longitudeData = position[1] ? position[1] : data.body.longitudeCurrent;

  const editedAddress = {
    idPoint: data.body.originPoint.fkIdPointCollect,
    address: data.body.originPoint.addressCollect,
    notes: data.body.originPoint.noteCollect,
    province: data.body.originPoint.provinceCollect,
    canton: data.body.originPoint.cantonCollect,
    district: data.body.originPoint.districtCollect,
    latitude: latitudeData,
    longitude: longitudeData,
    name: data.body.originPoint.nameContactCollect,
    phone: data.body.originPoint.phoneContactCollect,
    type: data.body.serviceType,
    schedule: {
      start: "08:00:00",
      end: "18:00:00",
    },
    idProfile: data.body.clientToDeliver.fkIdProfile,
    contactsAdditionalPoint: [
      {
        id: data.body.additionalContacts[0].idContact,
        name: data.body.additionalContacts[0].contactName,
        cellPhone: data.body.additionalContacts[0].contactPhone,
        order: data.body.additionalContacts[0].order,
      },
    ],
  };

  const showSuccessProcess = (text: string) => {
    toast({
      variant: "default",
      title: "Acción realizada",
      description: text,
    });
  };

  const submitAdress = async () => {
    if (position) {
      try {
        EditPackageAddress(editedAddress).then((res: any) => {
          if (res.status == "OK") {
            setShowModal(!showModal);
            showSuccessProcess("Dirección cambiada con éxito");
          }
        });
      } catch (error) {
        console.log("Error on route creation", error);
      }
    }
  };

  const mapChildren = (
    <div className="flex flex-col gap-4">
      <Label className="flex flex-row items-center gap-2 text-lg">
        <GetIcon iconName="location-icon"></GetIcon>Ubicación
      </Label>
      {data.body.latitudeCurrent && data.body.longitudeCurrent && (
        <Map
          draggable
          position={position}
          setPosition={setPosition}
          selectedLocations={[
            {
              pos: [data.body.latitudeCurrent, data.body.longitudeCurrent],
              id: data.body.idPackage.toString(),
              selected: false,
              idPackageSize: 0,
              idStatus: 0,
              statusTranslate: "",
              nameStatus: "",
              isCollect: 0,
            },
          ]}
          initialLocation={[
            data.body.latitudeCurrent,
            data.body.longitudeCurrent,
          ]}
          height={"300px"}
          width={heightScreen}
        />
      )}
      <div className="grid grid-cols-2">
        <div className="col-span-1 flex flex-col">
          <Label className="text-[#64748B] font-light">
            Dirección de entrega
          </Label>
          <p className="text-sm font-semibold">
            {data.body.destinationPoint.address}
          </p>
        </div>
        <div className="col-span-1 flex flex-col">
          <Label className="text-[#64748B] font-light">
            Notas sobre la dirección
          </Label>
          <p className="text-sm font-semibold">
            {data.body.destinationPoint.note}
          </p>
        </div>
      </div>
      <Button
        variant={"white"}
        className="shadow-none w-fit self-end mt-4"
        onClick={submitAdress}
      >
        Confirmar
      </Button>
    </div>
  );

  return (
    <>
      <DialogContent className="w-[640px] max-w-[90%] rounded-xl">
        <DialogHeader>
          <DialogTitle>Detalle del paquete</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-8">
          <div className="p-5 bg-slate-100 rounded-xl">
            <div className="flex">
              <div className="flex-2 flex flex-col gap-2">
                <Label className="text-md font-semibold">
                  Estado del envío
                </Label>
                <Label className="text-xs text-slate-500">
                  Una vez modificado el estado se enviará una notificación
                  automaticamente a moovin y al destinatario.
                </Label>
              </div>
            </div>

            <Separator className="my-6" />
            <div className="flex items-center w-full justify-between">
              <div className="flex-2 flex flex-col gap-2">
                <Label className="text-[14px]">
                  {data.body.clientToDeliver
                    ? data.body.clientToDeliver.clientName
                    : "Mauricio Guzman Madrigal"}
                </Label>
                <Label className="text-xs text-slate-500">
                  {data.body.clientToDeliver
                    ? data.body.clientToDeliver.cellPhone
                    : "Tel. 8870-1582"}
                </Label>
              </div>
              <WhatsAppContactButton
                phoneNumber={
                  data.body.clientToDeliver.cellPhone?.toString() || "0"
                }
                message="Test"
              />
            </div>
          </div>

          <SectionModal title={"Información"}>
            <InfoItem
              title={"Destinatario"}
              value={data.body.clientToDeliver.clientName || "María Gómez"}
            />
            <InfoItem
              title={"Teléfono"}
              value={data.body.clientToDeliver.cellPhone || "123456789"}
            />
            <InfoItem
              title={"Peso y dimensión"}
              value={
                data.body
                  ? (data.body.weight ? data.body.weight : 0) +
                    " " +
                    data.body.acronym
                  : "Medium: 2kg / 12x2x3"
              }
            />
            <InfoItem
              title={"Notas"}
              value={
                data.body.destinationPoint.note ||
                "del maxi pali 200 metros sur, detras de la licorera."
              }
            />
            <div>
              <Button
                iconName="load-packages"
                variant={"white"}
                onClick={() => setShowModal(!showModal)}
              >
                Editar dirección
              </Button>
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(!showModal)}
                widthAuto
              >
                {mapChildren}
              </Modal>
            </div>
          </SectionModal>

          <SectionModal title={"Solicitado por"} cols={3}>
            <InfoItem
              title={"Nombre y apellido"}
              value={data.body.clientSender.clientName || "María Gómez"}
            />
            <InfoItem
              title={"Teléfono"}
              value={data.body.clientSender.phone || "123456789"}
            />
            <InfoItem
              title={"Email"}
              value={data.body.clientSender.email || "nombre@email"}
            />
          </SectionModal>
        </div>
        <Separator className="my-6" />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              iconName="load-packages"
              variant={"white"}
              onClick={() => setShowReportModal(!showReportModal)}
            >
              Reportar
            </Button>
            <Modal
              isOpen={showReportModal}
              onClose={() => setShowReportModal(!showReportModal)}
            >
              {
                <ReportPackage
                  idPackage={data.body.idPackage}
                  closeModalFunction={() =>
                    setShowReportModal(!showReportModal)
                  }
                />
              }
            </Modal>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="white">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" variant={"black"}>
                Guardar
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default ScanDetailModal;
