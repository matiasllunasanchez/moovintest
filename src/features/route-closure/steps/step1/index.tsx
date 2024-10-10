import { GetPackageInfoCloseRoute } from "@/app/actions";
import { GetIcon } from "@/components/common/icon";
import Modal from "@/components/common/modal";
import { Button } from "@/components/custom/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import ScanPackage from "@/features/packages/package-load/sections/scan-package";
import { cn, decodeQr } from "@/lib/utils";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import ReturnPackageClosure from "./return-package";
import ScanErrorModal from "@/components/common/scan-error-modal";

type props = {
  route: RouteDetail;
  qrToProcess: PackageInfoForClosureWithStatus[];
  setQrToProcess: React.Dispatch<
    React.SetStateAction<PackageInfoForClosureWithStatus[]>
  >;
  setStepStatus: React.Dispatch<React.SetStateAction<boolean[]>>;
  noPackages: boolean;
  setNoPackages: React.Dispatch<React.SetStateAction<boolean>>;
};

const RouteClosureStep3: React.FC<props> = ({
  route,
  qrToProcess,
  setQrToProcess,
  setStepStatus,
  noPackages,
  setNoPackages,
}) => {
  const { user } = useUser();
  const [qrRead, setQrRead] = useState<InfoQr>();
  const [manualInput, setManualInput] = useState<string>("");
  const [noPending, setNoPending] = useState<boolean>(false);
  const [readErrorMessage, setReadErrorMessage] = useState<string>("");
  const [lastPackage, setLastPackage] = useState<PackageInfoForClosure>();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (
      (noPackages && noPending) ||
      (qrToProcess.length > 0 && noPending) ||
      route.packages?.length === 0
    ) {
      setStepStatus((prevState) => {
        const newStepsStatus = [...prevState];
        newStepsStatus[0] = true;
        return newStepsStatus;
      });
    } else {
      setStepStatus((prevState) => {
        const newStepsStatus = [...prevState];
        newStepsStatus[0] = false;
        return newStepsStatus;
      });
    }
  }, [noPackages, qrToProcess, noPending]);

  useEffect(() => {
    setNoPending(
      route.pendingPackagesCollect.length === 0 ||
        route.pendingPackagesCollect.every((idPackage) =>
          qrToProcess.some(
            (packageInfo) =>
              packageInfo.idPackage === Number(idPackage.idPackage)
          )
        )
    );
  }, [, qrToProcess]);

  const handleScan = useCallback(
    (data: any) => {
      const sound = new Audio("../scanner.wav");
      const soundError = new Audio("../scanner_bad.mp3");

      if (data?.text) {
        setReadErrorMessage("");
        let infoQr = decodeQr(data.text);
        setQrRead(infoQr);
        if (
          user?.delegate &&
          user?.delegate.idDelegate &&
          route.idRoute &&
          infoQr.idPackage
        ) {
          GetPackageInfoCloseRoute(
            user.delegate.idDelegate,
            route.idRoute,
            Number(infoQr.idPackage)
          ).then((res: PackageInfoForClosureResponse) => {
            if (res.httpCode === 200) {
              setLastPackage(res.body);
              setManualInput("");
              setShowModal(true);
              sound.play();
            } else {
              setReadErrorMessage(res.message);
              soundError.play();
            }
          });
        }
      }
    },
    [route.idRoute, user]
  );

  const handleReportPickUp = (idPackage: string) => {
    if (user?.delegate && route.idRoute && idPackage)
      GetPackageInfoCloseRoute(
        user.delegate.idDelegate,
        route.idRoute,
        Number(idPackage)
      ).then((res: PackageInfoForClosureResponse) => {
        if (res.httpCode === 200) {
          setLastPackage(res.body);
          setManualInput("");
          setShowModal(true);
        } else {
          setReadErrorMessage(res.message);
        }
      });
  };

  const handleAddPackageToList = (newStatus: string) => {
    lastPackage &&
      setQrToProcess((prev: PackageInfoForClosureWithStatus[]) => {
        const exists = prev.some(
          (pkg) => pkg.idPackage === lastPackage.idPackage
        );
        if (!exists) {
          return [
            ...prev,
            {
              ...lastPackage,
              newStatus: newStatus,
            },
          ];
        }
        return prev;
      });
  };

  return (
    <div className="flex flex-col p-6 gap-4">
      {route.pendingPackagesCollect.length > 0 && (
        <>
          <Label className={"text-xl"}>Recolecciones en estado pendiente</Label>

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
                disabled={route.pendingPackagesCollect.length === 0}
              >
                <div className="flex flex-row w-full items-center mr-2">
                  <div className="w-1 rounded-lg h-10" />
                  <span
                    className={classNames(
                      "flex ml-2 text-black font-medium",
                      !noPending && "text-red-500"
                    )}
                  >
                    Recolecciones pendientes
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <GetIcon iconName={"package-box"} className="w-4 h-4" />
                    <Label className=" text-nowrap">
                      {route.pendingPackagesCollect.length}
                    </Label>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col ">
                <div className="grid grid-cols-3 md:grid-cols-5 bg-[#F0F0F080] text-[16px] py-4 px-2 ">
                  <Label className="text-md text-[#64748B]">ID</Label>
                  <Label className="hidden md:flex text-md text-[#64748B]">
                    Perfil
                  </Label>
                  <Label className="hidden md:flex text-md text-[#64748B]">
                    Estado
                  </Label>
                  <Label className="text-md text-[#64748B] text-center">
                    Procesado
                  </Label>
                </div>
                {route.pendingPackagesCollect.map((qr) => {
                  return (
                    <div
                      className="grid grid-cols-3 md:grid-cols-5 text-md py-4 last:pb-0 px-2 border-t border-slate-200 text-[#0F172A]"
                      key={qr.idPackage}
                    >
                      <Label className="hidden md:flex md:flex-wrap text-md font-normal content-center">
                        #{qr.idPackage}
                      </Label>
                      <Label className="hidden md:flex md:flex-wrap text-md  font-normal content-center">
                        {qr.profileName}
                      </Label>
                      <Label className="text-md font-normal content-center">
                        {qr.statusTranslate}
                      </Label>
                      <Label className="text-md font-normal flex justify-center content-center flex-wrap">
                        {qrToProcess.some(
                          (pkg) => pkg.idPackage === Number(qr.idPackage)
                        ) ? (
                          <GetIcon
                            iconName={"success-icon"}
                            mainColor={"white"}
                            className="w-[20px] h-[20px] bg-green-500 rounded-full "
                          />
                        ) : (
                          <GetIcon
                            iconName={"fail-icon"}
                            mainColor={"white"}
                            className="w-[20px] h-[20px] bg-red-500 rounded-full "
                          />
                        )}
                      </Label>
                      <Button
                        onClick={() => handleReportPickUp(qr.idPackage)}
                        disabled={qrToProcess.some(
                          (pkg) => pkg.idPackage === Number(qr.idPackage)
                        )}
                      >
                        Reportar
                      </Button>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}
      <Label className="text-xl">Recepción de paquetes</Label>
      <div className="bg-[#EFF4F6] rounded-lg">
        <ScanPackage
          handleScan={handleScan}
          qrRead={qrRead?.idPackage}
          totals={{ bags: 0, packages: qrToProcess.length }}
          readErrorMessage={readErrorMessage}
          manualInput={manualInput}
          setManualInput={setManualInput}
          showDrawer={false}
          showTotals={false}
          disabled={noPackages}
          isShowingModal={!!readErrorMessage}
        />
        {showModal && lastPackage?.idPackage && (
          <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
            <ReturnPackageClosure
              route={route}
              closeModalFunction={() => setShowModal(!showModal)}
              packageForClosure={lastPackage}
              handleAddPackageToList={handleAddPackageToList}
            />
          </Modal>
        )}
        {!!readErrorMessage && (
          <ScanErrorModal
            errorMessage={readErrorMessage}
            onClose={() => setReadErrorMessage("")}
          />
        )}
      </div>

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
              disabled={qrToProcess.length === 0}
            >
              <div className="flex flex-row w-full items-center mr-2">
                <div className="w-1 rounded-lg h-10" />
                <span className="flex ml-2 text-black font-medium">
                  Paquetes devueltos
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <GetIcon iconName={"package-box"} className="w-4 h-4" />
                  <Label className=" text-nowrap">{qrToProcess.length}</Label>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col ">
              <div className="grid grid-cols-3 bg-[#F0F0F080] text-[16px] py-4 px-2 ">
                <Label className="text-md text-[#64748B]">ID</Label>
                <Label className="text-md text-[#64748B]">Perfil</Label>
                <Label className="text-md text-[#64748B]">Estado</Label>
              </div>
              {qrToProcess.length > 0 ? (
                qrToProcess.map((qr) => {
                  return (
                    <div
                      className="grid grid-cols-3 text-md py-4 last:pb-0 px-2 border-t border-slate-200 text-[#0F172A]"
                      key={qr.idPackage}
                    >
                      <Label className="text-md font-normal">
                        #{qr.idPackage}
                      </Label>
                      <Label className="text-md  font-normal">
                        {qr.profileName}
                      </Label>
                      <Label className="text-md  font-normal">
                        {qr.newStatus}
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

      <Label className="flex align-middle">
        <Checkbox
          checked={noPackages}
          className="mr-2"
          disabled={route.packages?.length === 0}
          onClick={() => setNoPackages(!noPackages)}
        ></Checkbox>
        No tengo paquetes a recepcionar
      </Label>
    </div>
  );
};

export default RouteClosureStep3;
