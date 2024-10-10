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
// import SectionModal from "./section";
// import { InfoItem } from "./section/info-item";
import { Label } from "@/components/ui/label";
import WhatsAppContactButton from "@/components/common/whatsapp-button";

type Props = {
  data: any; // Todo: Change when response types are ready
};

const DetailModal = ({ data }: Props) => {
  return (
    <>
      <DialogContent className="w-[640px]">
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
              <WhatsAppContactButton phoneNumber="123465" message="Test" />
            </div>

            <Separator className="my-6" />
            <div className="flex items-center w-full justify-between">
              <div className="flex-2 flex flex-col gap-2">
                <Label className="text-[14px]">
                  Mauricio Guzman Madrigal aaaaa
                </Label>
                <Label className="text-xs text-slate-500">Tel. 8870-1582</Label>
              </div>
              <WhatsAppContactButton phoneNumber="123465" message="Test" />
            </div>
          </div>
          {/* 
          <SectionModal title={"Información"}>
            <InfoItem title={"Destinatario"} value={"María Gómez"} />
            <InfoItem title={"Teléfono"} value={"123456789"} />
            <InfoItem
              title={"Peso y dimensión"}
              value={"Medium: 2kg / 12x2x3"}
            />
            <InfoItem
              title={"Notas"}
              value={"del maxi pali 200 metros sur, detras de la licorera."}
            />
            <div>
              <Button iconName="load-packages" variant={"white"}>
                Editar dirección
              </Button>
            </div>
          </SectionModal>

          <SectionModal title={"Solicitado por"} cols={3}>
            <InfoItem title={"Nombre y apellido"} value={"María Gómez"} />
            <InfoItem title={"Teléfono"} value={"123456789"} />
            <InfoItem title={"Email"} value={"nombre@email"} />
          </SectionModal> */}
        </div>
        <Separator className="my-6" />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button iconName="load-packages" variant={"white"}>
              Reportar
            </Button>
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

export default DetailModal;
