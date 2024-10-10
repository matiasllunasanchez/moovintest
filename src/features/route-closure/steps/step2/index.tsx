import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, useEffect, useState } from "react";

type props = {
  route: RouteDetail;
  setStepStatus: React.Dispatch<React.SetStateAction<boolean[]>>;
  finalCashReceived: { cashColon: number; cashDollars: number };
  setFinalCashReceived: React.Dispatch<
    React.SetStateAction<{ cashColon: number; cashDollars: number }>
  >;
};

const RouteClosureStep1: React.FC<props> = ({
  route,
  setStepStatus,
  setFinalCashReceived,
  finalCashReceived,
}) => {
  const [send, setSend] = useState<boolean>(
    finalCashReceived.cashColon === route.payments.cashColon &&
      finalCashReceived.cashDollars === route.payments.cashDollars
  );
  const [cashReceived, setCashReceived] = useState<{
    cashColon: number;
    cashDollars: number;
  }>(finalCashReceived ? finalCashReceived : { cashColon: 0, cashDollars: 0 });

  useEffect(() => {
    route.payments.cashColon + route.payments.cashDollars === 0 &&
      setStepStatus((prevState) => {
        const newStepsStatus = [...prevState];
        newStepsStatus[1] = true;
        return newStepsStatus;
      });
  }, []);

  const handleClick = () => {
    setFinalCashReceived(cashReceived);
    if (
      cashReceived.cashColon === route.payments.cashColon &&
      cashReceived.cashDollars === route.payments.cashDollars
    ) {
      setStepStatus((prevState) => {
        const newStepsStatus = [...prevState];
        newStepsStatus[1] = true;
        return newStepsStatus;
      });
      setSend(true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value ? parseFloat(value).toString() : "";
    setCashReceived((prev) => ({
      ...prev,
      [name]: cleanedValue ? Number(cleanedValue) : 0,
    }));
  };
  return (
    <div className="flex flex-col p-6 gap-4">
      <Label className="text-xl">Conciliación de pago</Label>
      <Label className="text-md">
        Total Colones a recibir: ${route.payments.cashColon}
      </Label>
      <Input
        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="Ingrese el monto recibido"
        name="cashColon"
        type={"number"}
        value={cashReceived.cashColon !== 0 ? cashReceived.cashColon : ""}
        disabled={route.payments.totalAmountColon === 0 || send}
        onChange={(e) => handleChange(e)}
      ></Input>
      <Label className="text-md">
        Total Dólares a recibir: ${route.payments.cashDollars}
      </Label>
      <Input
        placeholder="Ingrese el monto recibido"
        name="cashDollars"
        type={"number"}
        value={cashReceived.cashDollars !== 0 ? cashReceived.cashDollars : ""}
        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        disabled={
          route.payments.cashColon + route.payments.cashDollars === 0 || send
        }
        onChange={(e) => handleChange(e)}
      ></Input>
      <Button
        className="bg-[#173341] w-fit mt-4"
        onClick={handleClick}
        disabled={send}
      >
        Ingresar
      </Button>
      <>
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col !gap-2"
        >
          <AccordionItem
            key={route.idRoute}
            value={`${route.idRoute}`}
            className={cn(
              "!rounded-md border border-solid border-slate-300 px-2"
            )}
          >
            <AccordionTrigger
              className="flex justify-between p-2 hover:no-underline  transition-all duration-300"
              disabled={route.payments.paymentsPackages.length === 0}
            >
              <div className="flex flex-row w-full items-center mr-2">
                <div className="w-1 rounded-lg h-10" />
                <span className="flex mx-2 text-black font-medium">
                  Paquetes con cobro
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <GetIcon iconName="package-box" className="w-4 h-4"></GetIcon>
                  <Label className=" text-nowrap">
                    {route.payments.paymentsPackages.length}
                  </Label>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col ">
              <div className="grid grid-cols-4 bg-[#F0F0F080] text-[16px] py-4 px-2 ">
                <Label className="text-md text-[#64748B]">ID</Label>
                <Label className="text-md text-[#64748B]">Perfil</Label>
                <Label className="text-md text-[#64748B]">Monto COL</Label>
                <Label className="text-md text-[#64748B]">Monto USD</Label>
              </div>
              {route.payments.paymentsPackages.length > 0 ? (
                route.payments.paymentsPackages.map((pk) => {
                  return (
                    <div
                      className="grid grid-cols-4 text-md py-4 last:pb-0 px-2 border-t border-slate-200 text-[#0F172A]"
                      key={pk.idPackage}
                    >
                      <Label className="text-md font-normal">
                        #{pk.idPackage}
                      </Label>
                      <Label className="text-md  font-normal">
                        {pk.profileName}
                      </Label>
                      <Label className="text-md  font-normal">
                        $ {pk.cashColon}
                      </Label>
                      <Label className="text-md  font-normal">
                        $ {pk.cashDollars}
                      </Label>
                    </div>
                  );
                })
              ) : (
                <>
                  <p>Ningun paquete devuelto</p>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    </div>
  );
};

export default RouteClosureStep1;
