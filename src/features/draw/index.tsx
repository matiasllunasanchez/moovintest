"use client";
import { GetPackageInfo } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { decodeQr } from "@/lib/utils";
import React, { useState } from "react";
import ScanPackage from "../packages/package-load/sections/scan-package";
import ScanErrorModal from "@/components/common/scan-error-modal";

const DrawContainer: React.FC = () => {
  const [readedPackage, setReadedPackage] = useState<MoovinPackage>();
  const [manualInput, setManualInput] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [qrRead, setQrRead] = useState<InfoQr>();
  const [readErrorMessage, setReadErrorMessage] = useState<string>("");

  const sound = new Audio("../scanner.wav");
  const soundError = new Audio("../scanner_bad.mp3");

  const handleScan = (data: any) => {
    if (data?.text) {
      setShowSpinner(true);
      setReadErrorMessage("");
      setTimeout(() => {
        setShowSpinner(false);
      }, 500);
      let infoQr = decodeQr(data.text);
      setQrRead(infoQr);
      GetPackageInfo(infoQr.idPackage).then((res: any) => {
        // console.log(res);
        if (res.httpCode === 200) {
          setManualInput("");
          sound.play();
          setReadedPackage(res);
        } else {
          setReadErrorMessage(res.message);
          soundError.play();
        }
      });
    }
  };
  return (
    <>
      <div className="flex justify-center w-full">
        <div className="md:w-[50%] flex flex-col w-full gap-4  self-center">
          <Label className="text-2xl font-bold align-start">Cajón:</Label>
          <div className=" rounded-lg  bg-[#EFF4F6] h-full">
            <ScanPackage
              handleScan={handleScan}
              qrRead={qrRead?.idPackage}
              readErrorMessage={readErrorMessage}
              manualInput={manualInput}
              setManualInput={setManualInput}
              drawer={readedPackage?.body.drawer}
              showDrawer={true}
              showTotals={false}
              showSpinner={showSpinner}
              isShowingModal={!!readErrorMessage}
            />
          </div>
        </div>
      </div>
      {!!readErrorMessage && (
        <ScanErrorModal
          errorMessage={readErrorMessage}
          onClose={() => setReadErrorMessage("")}
        />
      )}
    </>
  );
};

export default DrawContainer;
