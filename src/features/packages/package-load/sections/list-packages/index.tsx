import { GetPackageInfo } from "@/app/actions";
import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, SeparatePackageData } from "@/lib/utils";
import classNames from "classnames";
import { useEffect, useState } from "react";
import ScanDetailModal from "../detail-package";

type props = {
  qrToProcess?: MoovinPackage[];
};

type TabType = { status: "readed" | "pending"; bagCode: string }[];
const ListPackages: React.FC<props> = ({ qrToProcess }) => {
  const [tabSelected, setTabSelected] = useState<TabType>([
    { bagCode: "0", status: "readed" },
  ]);
  const [accordions, setAccordions] = useState<MoovinPackageAccordions[]>([]);
  const [bags, setBags] = useState<MoovinPackage[]>([]);

  useEffect(() => {
    qrToProcess &&
      qrToProcess.length > 0 &&
      setAccordions(SeparatePackageData(qrToProcess));
  }, [, qrToProcess]);

  useEffect(() => {
    let newBag = accordions.find(
      (el) =>
        el.bagCode != "0" && !bags.some((bag) => bag.body.bagCode == el.bagCode)
    );
    newBag?.bagCode &&
      GetPackageInfo(newBag.bagCode).then((res: any) => {
        setBags((prev) => [...prev, res]);
        setTabSelected((prev) => [
          ...prev,
          { bagCode: newBag?.bagCode || "0", status: "readed" },
        ]);
      });
  }, [accordions]);

  return (
    <>
      {accordions.map((accordion) => {
        return (
          <Accordion
            type="single"
            key={accordion.bagCode}
            collapsible
            className="w-full flex flex-col !gap-2 "
          >
            <AccordionItem
              key={1}
              value={"1"}
              className={cn(
                "!rounded-md border border-solid border-slate-300 px-2"
              )}
            >
              <AccordionTrigger className="flex justify-between p-2 hover:no-underline hover:opacity-70 transition-all duration-300">
                <div className="flex flex-row w-full items-center mr-2">
                  <div className="w-1 rounded-lg h-10" />
                  <span className="flex ml-2 text-black font-medium">
                    {accordion.bagCode == "0"
                      ? "Paquetes sueltos"
                      : "Bolsa #" + accordion.bagCode}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <GetIcon iconName={"package-box"} className="w-4 h-4" />
                    <Label className=" text-nowrap">
                      {accordion.bagCode == "0"
                        ? accordion.rededPackages.length
                        : accordion.numberPackages +
                          "/" +
                          bags.find(
                            (el) => el.body.bagCode == accordion.bagCode
                          )?.body.numberPackages}
                    </Label>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {accordion.bagCode != "0" && (
                  <Tabs defaultValue="readed" className="my-2 ">
                    <div className="w-fit">
                      <TabsList className="flex flex-col gap-2 md:flex-row md:justify-between w-fit ">
                        <div className="flex flex-row gap-2 p-2 rounded-md  justify-evenly">
                          <TabsTrigger
                            value="readed"
                            onClick={() =>
                              setTabSelected((prev) =>
                                prev.map((item) =>
                                  item.bagCode === accordion.bagCode
                                    ? { ...item, status: "readed" }
                                    : item
                                )
                              )
                            }
                          >
                            Ingresados
                          </TabsTrigger>
                          <TabsTrigger
                            value="pending"
                            onClick={() =>
                              setTabSelected((prev) =>
                                prev.map((item) =>
                                  item.bagCode === accordion.bagCode
                                    ? { ...item, status: "pending" }
                                    : item
                                )
                              )
                            }
                          >
                            Pendientes
                          </TabsTrigger>
                        </div>
                        <div className="flex flex-row gap-2"></div>
                      </TabsList>
                    </div>
                  </Tabs>
                )}
                <div className="flex flex-col md:block rounded-lg border border-gray ">
                  <div className="flex flex-row p-4 text-sm text-[#71717A]  bg-[#F7F7F7] ">
                    <Label className="w-[15%] text-center">Nº ID</Label>
                    <Label className="hidden md:flex w-[30%]">Remitente</Label>
                    <Label className="hidden md:flex w-[30%]">
                      Destinatario
                    </Label>
                    <Label className="hidden md:flex w-[15%]">Tipo</Label>
                    <Label className="w-[10%]"></Label>
                  </div>
                  {accordion && accordion.rededPackages.length > 0 ? (
                    tabSelected.find((el) => el.bagCode === accordion.bagCode)
                      ?.status === "readed" ? (
                      accordion.rededPackages.map((qrRead) => (
                        <div
                          key={
                            qrRead.body.idPackage
                              ? qrRead.body.idPackage
                              : qrRead.body.bagCode
                          }
                          className={
                            "flex flex-row justify-between  px-4 text-sm py-3 items-center border-t border-gray "
                          }
                        >
                          <Label className="md:w-[15%] text-center">
                            {qrRead.body.idPackage
                              ? qrRead.body.idPackage
                              : qrRead.body.bagCode}
                          </Label>
                          <Label className="hidden md:flex w-[30%]">
                            {qrRead.body.clientSender
                              ? qrRead.body.clientSender.clientName
                              : qrRead.body.idWarehouseOriginName}
                          </Label>
                          <Label className="hidden md:flex w-[30%]">
                            {qrRead.body.clientToDeliver
                              ? qrRead.body.clientToDeliver.clientName
                              : qrRead.body.delegateDestinationName}
                          </Label>
                          <Label className="hidden md:flex w-[15%]">
                            {qrRead.body.idPackage ? "Paquete" : "Bulto"}
                          </Label>
                          <div className="flex justify-end md:w-[10%]">
                            <DialogTrigger asChild>
                              <Button
                                variant={"black"}
                                className={
                                  (classNames(qrRead.body.bagCode && "hidden"),
                                  "w-[71px] h-[36px] ")
                                }
                                disabled={qrRead.body.bagCode ? true : false}
                              >
                                Detalle
                              </Button>
                            </DialogTrigger>
                          </div>
                          {qrRead.body.idPackage && (
                            <ScanDetailModal data={qrRead} />
                          )}
                        </div>
                      ))
                    ) : (
                      bags &&
                      bags
                        .find((bag) => bag.body.bagCode === accordion.bagCode)
                        ?.body.packages.filter(
                          (el) =>
                            !accordion.rededPackages.some(
                              (rp) => rp.body.idPackage === el.idPackage
                            )
                        )
                        .map((qrRead) => (
                          <div
                            key={qrRead.idPackage}
                            className={
                              "flex flex-row justify-between px-4 text-sm py-3 items-center border-t border-gray"
                            }
                          >
                            <Label className="md:w-[15%] text-center">
                              {qrRead.idPackage}
                            </Label>
                            <Label className="hidden md:flex w-[30%]">
                              {qrRead.clientName}
                            </Label>
                            <Label className="hidden md:flex w-[30%]">
                              {qrRead.clientName}
                            </Label>
                            <Label className="hidden md:flex w-[15%]">
                              Paquete
                            </Label>
                            <div className="flex justify-end md:w-[10%]">
                              <DialogTrigger asChild>
                                <Button
                                  variant={"black"}
                                  className="w-[71px] h-[36px] "
                                  disabled
                                >
                                  Detalle
                                </Button>
                              </DialogTrigger>
                            </div>
                          </div>
                        ))
                    )
                  ) : (
                    <div className="p-4">
                      <Label className="italic">Esperando carga...</Label>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
};

export default ListPackages;
