"use client";
import { GetPackageInfo, ReceivePackages } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { decodeQr } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import InfoPackage from "./sections/info-package";
import ListPackages from "./sections/list-packages";
import ScanPackage from "./sections/scan-package";
import { Button } from "@/components/custom/button";
import { useRouter } from "next/navigation";
import { MOOVIN_URLS } from "@/utils/urls";
import Modal from "@/components/common/modal";
import { GetIcon } from "@/components/common/icon";
import InfoBag from "./sections/info-bag";
import { toast } from "@/components/ui/use-toast";
import ScanErrorModal from "@/components/common/scan-error-modal";

const PackagesContainer: React.FC = () => {
  const { user, selectedWarehouse } = useUser();
  const [qrRead, setQrRead] = useState<InfoQr>();
  const [manualInput, setManualInput] = useState<string>("");
  const [readErrorMessage, setReadErrorMessage] = useState<string>("");
  const [qrToProcess, setQrToProcess] = useState<MoovinPackage[]>([]);
  const [lastPackage, setLastPackage] = useState<MoovinPackage>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBagModal, setShowBagModal] = useState<boolean>(false);
  const [packageError, setPackageError] = useState<string>("");
  const [showPackageWithBagModal, setShowPackageWithBagModal] =
    useState<boolean>(false);
  const [showPackageErrorModal, setShowPackageErrorModal] =
    useState<boolean>(false);
  const [totalsReaded, setTotalsReaded] = useState<{
    bags: number;
    packages: number;
  }>({ bags: 0, packages: 0 });
  const router = useRouter();
  const sound = new Audio("../scanner.wav");
  const soundError = new Audio("../scanner_bad.mp3");

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

  useEffect(() => {
    setTotalsReaded({
      bags: qrToProcess.filter((el) => el.body.bagCode).length,
      packages: qrToProcess.filter((el) => el.body.idPackage).length,
    });
  }, [qrToProcess]);
  useEffect(() => {
    //verifico que el qr corresponda a una bolsa
    !lastPackage?.body.idPackage &&
      lastPackage?.body.bagCode &&
      setShowBagModal(true);

    //verifico que el qr corresponde a un paquete vinculado a una bolsa y que es el primero en leerse de la bolsa
    lastPackage?.body.idPackage &&
      lastPackage?.body.codeBag &&
      !qrToProcess.some(
        (el) =>
          el.body.codeBag === lastPackage.body.codeBag &&
          el.body.idPackage != lastPackage.body.idPackage
      ) &&
      setShowPackageWithBagModal(true);
  }, [lastPackage]);

  const handleScan = (data: any) => {
    if (data?.text) {
      setReadErrorMessage("");
      let infoQr = decodeQr(data.text);

      setQrRead(infoQr);
      GetPackageInfo(infoQr.idPackage).then((res: any) => {
        if (res.httpCode === 200) {
          setManualInput("");
          if (res.body.hasError === 1) {
            soundError.play();
            setShowPackageErrorModal(true);
            setPackageError(
              "Código #" +
                infoQr.idPackage +
                " - " +
                res.body.errorMessage +
                ". No se agregara a la lista"
            );
          } else {
            setLastPackage(res);
            sound.play();
            showSuccessProcess("Codigo leído correctamente.");
            handleAddPackageToList(res);
          }
        } else {
          soundError.play();
          showErrorProcess(res.message);
          setReadErrorMessage(res.message);
        }
      });
    }
  };

  const handleAddPackageToList = (data: MoovinPackage) => {
    if (data.body.idPackage) {
      setQrToProcess((prev) => {
        const exists = prev.some(
          (pkg) => pkg.body.idPackage === data.body.idPackage
        );
        if (!exists) {
          return [...prev, data];
        }
        return prev;
      });
    } else {
      setQrToProcess((prev) => {
        const exists = prev.some(
          (pkg) => pkg.body.bagCode === data.body.bagCode
        );
        if (!exists) {
          return [...prev, data];
        }
        return prev;
      });
    }
  };

  const handleEndProcess = () => {
    if (user?.delegate?.idDelegate && selectedWarehouse?.id) {
      const packagesToReceive: MoovinPackagesReception = {
        idDelegate: user?.delegate?.idDelegate,
        idWarehouse: selectedWarehouse?.id,
        codes: qrToProcess.map((qr) => ({
          itemCode: qr.body.idPackage
            ? qr.body.idPackage.toString()
            : qr.body.bagCode,
          codeBag: qr.body.codeBag ? qr.body.codeBag : null,
        })),
      };
      ReceivePackages(packagesToReceive).then((res: any) => {
        if (res.httpCode === 200) {
          setShowModal(true);
        } else {
          setReadErrorMessage(res.message);
        }
      });
    }
  };

  const handleConfirmProcess = () => {
    setQrToProcess([]);
    setShowModal(false);
    router.push(MOOVIN_URLS.PACKAGES.MAIN);
  };
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className=" flex flex-col md:w-[35%]  rounded-lg  bg-[#EFF4F6] h-full justify-between">
          <ScanPackage
            handleScan={handleScan}
            qrRead={qrRead?.idPackage}
            totals={totalsReaded}
            readErrorMessage={readErrorMessage}
            manualInput={manualInput}
            setManualInput={setManualInput}
            showDrawer={false}
            showTotals={true}
            isShowingModal={showPackageErrorModal || !!readErrorMessage}
          />
          <Button
            className="mx-6 mb-6"
            onClick={handleEndProcess}
            disabled={qrToProcess.length > 0 ? false : true}
          >
            Finalizar carga
          </Button>
        </div>
        <div className="md:w-[65%] border border-[#E4E4E7] rounded-[12px]">
          <>
            {lastPackage &&
              (lastPackage?.body.idPackage ? (
                <InfoPackage readedPackage={lastPackage}></InfoPackage>
              ) : (
                <InfoBag readedBag={lastPackage} />
              ))}
            {showBagModal && (
              <Modal
                isOpen={showBagModal}
                onClose={() => setShowBagModal(!showBagModal)}
              >
                <div className="flex flex-col  md:w-[30vw] ">
                  <Label className="flex flex-row items-center gap-2 text-lg">
                    <GetIcon iconName="bag-icon"></GetIcon>Lectura de bolsa
                  </Label>
                  <Label className="p-6 text-center text-md ">
                    Ya puede liberar al mensajero.
                  </Label>
                  <Button onClick={() => setShowBagModal(!showBagModal)}>
                    Aceptar
                  </Button>
                </div>
              </Modal>
            )}
            {showPackageErrorModal && (
              <Modal
                isOpen={showPackageErrorModal}
                onClose={() => setShowPackageErrorModal(!showPackageErrorModal)}
              >
                <div className="flex flex-col  md:w-[30vw] ">
                  <Label className="flex flex-row items-center gap-2 text-lg">
                    <GetIcon iconName="bag-icon"></GetIcon>Lectura de Código
                  </Label>
                  <Label className="p-6 text-center text-md ">
                    {packageError}
                  </Label>
                  <Button
                    onClick={() =>
                      setShowPackageErrorModal(!showPackageErrorModal)
                    }
                  >
                    Aceptar
                  </Button>
                </div>
              </Modal>
            )}

            {!!readErrorMessage && (
              <ScanErrorModal
                errorMessage={readErrorMessage}
                onClose={() => setReadErrorMessage("")}
              />
            )}

            {showPackageWithBagModal && (
              <Modal
                isOpen={showPackageWithBagModal}
                onClose={() =>
                  setShowPackageWithBagModal(!showPackageWithBagModal)
                }
              >
                <div className="flex flex-col md:w-[30vw] ">
                  <Label className="flex flex-row items-center gap-2 text-lg">
                    <GetIcon iconName="bag-icon"></GetIcon>Lectura de paquete de
                    una bolsa
                  </Label>
                  <Label className="p-6 text-center text-md ">
                    Esta leyendo paquetes que corresponden a la bolsa #
                    {lastPackage?.body.codeBag}
                  </Label>
                  <Button
                    onClick={() =>
                      setShowPackageWithBagModal(!showPackageWithBagModal)
                    }
                  >
                    Aceptar
                  </Button>
                </div>
              </Modal>
            )}
          </>
        </div>
      </div>
      <div className="flex flex-col  py-4">
        <Label className="text-lg hidden md:flex">Listado de ingresos</Label>
      </div>
      {qrToProcess && <ListPackages qrToProcess={qrToProcess} />}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
          <div className="flex flex-col w-[90%] md:w-[30vw] ">
            <Label className="flex flex-row items-center gap-2 text-lg">
              <GetIcon iconName="bag-icon"></GetIcon>Fin de proceso
            </Label>
            <Label className="p-6 text-center text-md ">
              Paquetes Recibidos exitosamente
            </Label>
            <Button onClick={handleConfirmProcess}>Aceptar</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PackagesContainer;
