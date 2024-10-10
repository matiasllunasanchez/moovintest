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
import SectionModal from "./section";
import { InfoItem } from "./section/info-item";
import { Label } from "@/components/ui/label";
import WhatsAppContactButton from "@/components/common/whatsapp-button";
import Modal from "@/components/common/modal";
import dynamic from "next/dynamic";
import { GetIcon } from "@/components/common/icon";
import { EditPackageAddress } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import useMediaQuery, { desktop } from "@/utils/useMediaQuery";

type Props = {
  data: MoovinPackage; // Todo: Change when response types are ready
  onClose?: () => void;
  disabled?: boolean;
};

const Map = dynamic(() => import("@/components/map"), { ssr: false });

const DetailModal = ({ data, onClose, disabled = false }: Props) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number]>([
    data.body.originPoint.latitudeCollect,
    data.body.originPoint.longitudeCollect,
  ]);
  const [errors, setErrors] = useState<{ address: string; notes: string }>({
    address: "",
    notes: "",
  });
  const isDesktop = useMediaQuery(desktop);
  const [editAddress, setEditAddress] = useState<{
    address: string;
    notes: string;
  }>({
    address: data.body.originPoint.addressCollect,
    notes: data.body.originPoint.noteCollect,
  });
  console.log(isDesktop, "isdesktop");

  const heightScreen = isDesktop ? "50vw" : "100%";

  const latitudeData = position[0]
    ? position[0]
    : data.body.originPoint.latitudeCollect;

  const longitudeData = position[1]
    ? position[1]
    : data.body.originPoint.longitudeCollect;

  const editedAddress = {
    idPoint: data.body.originPoint.fkIdPointCollect,
    address: editAddress.address,
    notes: editAddress.notes,
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

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditAddress({
      ...editAddress,
      [name]: value,
    });
  };

  const showSuccessProcess = (text: string) => {
    toast({
      variant: "default",
      title: "Acción realizada",
      description: text,
    });
  };

  const submitAdress = async () => {
    let hasError = false;

    if (!editAddress.address) {
      setErrors((prev) => ({
        ...prev,
        address: "Debe completar la dirección para continuar",
      }));
      hasError = true;
    }

    if (!editAddress.notes) {
      setErrors((prev) => ({
        ...prev,
        notes: "Debe completar las notas para continuar",
      }));
      hasError = true;
    }

    // Si hay errores, no continuar
    if (hasError) {
      return;
    }
    if (position) {
      const updatedAddress = {
        ...editedAddress,
        address: editAddress.address,
        notes: editAddress.notes,
      };

      try {
        EditPackageAddress(updatedAddress).then((res: any) => {
          if (res.status === "OK") {
            setShowModal(false);
            showSuccessProcess("Dirección cambiada con éxito");
          }
        });
      } catch (error) {
        console.log("Error on route creation", error);
      }
    }
  };

  const mapChildren = (
    <div className="flex flex-col gap-4 w-auto">
      <Label className="flex flex-row items-center gap-2 text-lg">
        <GetIcon iconName="location-icon"></GetIcon>Ubicación
      </Label>

      {data.body.originPoint.latitudeCollect &&
      data.body.originPoint.longitudeCollect ? (
        <Map
          draggable={!disabled}
          position={position}
          setPosition={setPosition}
          selectedLocations={[
            {
              pos: [
                data.body.originPoint.latitudeCollect,
                data.body.originPoint.longitudeCollect,
              ],
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
            data.body.originPoint.latitudeCollect,
            data.body.originPoint.longitudeCollect,
          ]}
          height={"300px"}
          width={heightScreen}
          markCenter
        />
      ) : (
        <div className="flex flex-grow items-center justify-center p-5">
          <Label className="text-slate-300 font-light text-center ">
            El mapa no se ha cargado. <br />
            El paquete no posee latitud / longitud
          </Label>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="col-span-1 flex flex-col gap-2">
          <Label className="text-[#64748B] font-light">
            Dirección de entrega
          </Label>

          <Input
            name="address"
            className="text-sm font-semibold"
            value={editAddress.address}
            onChange={handleInputChange}
            placeholder="Ingrese la dirección"
            required
            disabled={disabled}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          <Label className="text-[#64748B] font-light">
            Notas sobre la dirección
          </Label>

          <Input
            name="notes"
            className="text-sm font-semibold"
            value={editAddress.notes}
            onChange={handleInputChange}
            placeholder="Ingrese las notas"
            required
            disabled={disabled}
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
          )}
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
      <DialogContent
        className="w-[640px] max-w-[90%] rounded-xl"
        onClose={onClose}
      >
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
                  {data.body.clientToDeliver.clientName}
                </Label>
                <Label className="text-xs text-slate-500">
                  Tel. {data.body.clientToDeliver.cellPhone}
                </Label>
              </div>
              <WhatsAppContactButton
                phoneNumber={data.body.clientToDeliver.cellPhone || ""}
                message="Test"
              />
            </div>
          </div>

          <SectionModal title={"Información"}>
            <InfoItem
              title={"Destinatario"}
              value={data.body.clientToDeliver.clientName || ""}
            />
            <InfoItem
              title={"Teléfono"}
              value={data.body.clientToDeliver.cellPhone || ""}
            />
            <InfoItem
              title={"Peso y dimensión"}
              value={data.body.acronym + "/" + data.body.weight + "kg"}
            />
            <InfoItem title={"Notas"} value={data.body.destinationPoint.note} />
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
              value={data.body.clientSender.clientName}
            />
            <InfoItem
              title={"Teléfono"}
              value={data.body.clientSender.phone || ""}
            />
            <InfoItem
              title={"Email"}
              value={data.body.clientSender.email || ""}
            />
          </SectionModal>
        </div>
        <Separator className="my-6" />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button iconName="load-packages" variant={"white"} disabled>
              Reportar
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="white" onClick={onClose}>
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

export default DetailModal;
