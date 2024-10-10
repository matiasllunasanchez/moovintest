import { GetIcon } from "@/components/common/icon";
import Modal from "@/components/common/modal";
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import useMediaQuery, { desktop } from "@/utils/useMediaQuery";
import { Separator } from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
import { useState } from "react";
import ReportPackage from "../report-package";

type props = {
  readedPackage?: MoovinPackage;
};
const Map = dynamic(() => import("@/components/map"), { ssr: false });
const InfoPackage: React.FC<props> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const isDesktop = useMediaQuery(desktop);
  const heightScreen = isDesktop ? "50vw" : "100%";
  const mapChildren = (
    <div className="flex flex-col gap-4">
      <Label className="flex flex-row items-center gap-2 text-lg">
        <GetIcon iconName="location-icon"></GetIcon>Ubicación
      </Label>
      {props.readedPackage?.body.latitudeCurrent &&
        props.readedPackage.body.longitudeCurrent && (
          <Map
            selectedLocations={[
              {
                pos: [
                  props.readedPackage?.body.latitudeCurrent,
                  props.readedPackage?.body.longitudeCurrent,
                ],
                id: props.readedPackage?.body.idPackage.toString(),
                selected: false,
                idPackageSize: 0,
                idStatus: 0,
                statusTranslate: "",
                nameStatus: "",
                isCollect: 0,
              },
            ]}
            initialLocation={[
              props.readedPackage?.body.latitudeCurrent,
              props.readedPackage?.body.longitudeCurrent,
            ]}
            height={"300px"}
            width={heightScreen}
            markCenter
          />
        )}
      <div className="grid grid-cols-2">
        <div className="col-span-1 flex flex-col">
          <Label className="text-[#64748B] font-light">
            Dirección de entrega
          </Label>
          <p className="text-sm font-semibold">
            {props.readedPackage?.body.destinationPoint.address}
          </p>
        </div>
        <div className="col-span-1 flex flex-col">
          <Label className="text-[#64748B] font-light">
            Notas sobre la dirección
          </Label>
          <p className="text-sm font-semibold">
            {props.readedPackage?.body.destinationPoint.note}
          </p>
        </div>
      </div>
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
    <div className="flex flex-col w-full p-4 gap-1 md:gap-6">
      <div className="flex flex-row justify-between">
        <Label className="text-base md:text-xl flex flex-row items-center">
          <GetIcon
            iconName="package-box"
            className="hidden md:flex w-[20px] mr-2"
          ></GetIcon>
          Detalle de paquete:{" "}
          {props.readedPackage?.body.idPackage &&
            "#" + props.readedPackage?.body.idPackage}
        </Label>
        <Button
          variant={"white"}
          className="shadow-none hidden md:flex"
          iconName="reclaim-icon"
          disabled={!props.readedPackage?.body.idPackage}
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
              idPackage={props.readedPackage?.body.idPackage || 0}
              closeModalFunction={() => setShowReportModal(!showReportModal)}
            />
          }
        </Modal>
      </div>

      <div>
        <Label className="text-[#64748B] hidden md:flex">Entregar a:</Label>
        <div className="flex flex-col mt-4 gap-1 md:grid md:grid-cols-3">
          <div>
            <Label className="text-[#64748B] font-normal">Destinatario</Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.clientToDeliver.clientName || "-"}
            </p>
          </div>
          <div>
            <Label className="text-[#64748B] font-normal">Teléfono</Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.clientToDeliver.cellPhone || "-"}
            </p>
          </div>
          <div>
            <Label className="text-[#64748B] font-normal">
              Numero de seguimiento
            </Label>
            <p className="font-semibold text-sm mt-2">
              #{props.readedPackage?.body.idPackage || "-"}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col md:grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#64748B] font-normal">
              Dirección de entrega
            </Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.destinationPoint.address || "-"}
            </p>
          </div>
          <div>
            <Label className="text-[#64748B] font-normal">
              Notas sobre la dirección
            </Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.destinationPoint.note || "-"}
            </p>
          </div>
        </div>

        <Button
          disabled={!props.readedPackage?.body.idPackage}
          variant={"white"}
          className="shadow-none mt-4 hidden md:flex"
          iconName="location-icon"
          onClick={() => setShowModal(!showModal)}
        >
          Ver ubicación
        </Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
          {mapChildren}
        </Modal>
      </div>
      <div className="grid grid-cols-2 max-w-[350px]">
        <div>
          <Label className="text-[#64748B] font-normal">Peso</Label>
          <p className="font-semibold text-sm mt-2">
            {props.readedPackage?.body.weight || "-" + " kg"}
          </p>
        </div>
        <div>
          <Label className="text-[#64748B] font-normal">Dimensiones</Label>
          <p className="font-semibold text-sm mt-2">
            {props.readedPackage?.body.acronym || "-"}
          </p>
        </div>
      </div>
      <Separator className="border-t border-[#E4E4E7] my-2 md:my-0" />
      <div>
        <Label className="text-[#64748B] font-normal text-base hidden md:flex">
          Solictado por:
        </Label>
        <div className="flex flex-col mt-4 md:grid md:grid-cols-5">
          <div className="col-span-2">
            <Label className="text-[#64748B] font-normal">Remitente:</Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.clientSender.clientName || "-"}
            </p>
          </div>
          <div className="col-span-2">
            <Label className="text-[#64748B] font-normal ">Email:</Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.clientSender.email || "-"}
            </p>
          </div>
          <div>
            <Label className="text-[#64748B] font-normal">Teléfono:</Label>
            <p className="font-semibold text-sm mt-2">
              {props.readedPackage?.body.clientSender.phone || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPackage;
