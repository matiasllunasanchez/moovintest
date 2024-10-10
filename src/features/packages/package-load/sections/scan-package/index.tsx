import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import LoadingBox from "@/components/loading-box";
import QrReaderWrapper from "@/components/qreader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

type props = {
  handleScan: (data: any) => void;
  qrRead?: string;
  totals?: { bags: number; packages: number };
  readErrorMessage: string;
  manualInput: string;
  setManualInput: (data: string) => void;
  drawer?: number;
  showTotals: boolean;
  showDrawer: boolean;
  disabled?: boolean;
  showSpinner?: boolean;
  isShowingModal?: boolean;
};

const ScanPackage: React.FC<props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
      if (props.readErrorMessage !== "" || props.isShowingModal)
        inputRef.current.select();
    }
  }, [props.readErrorMessage, props.isShowingModal]);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setManualInput(e.target.value);
  };

  const handleScanAction = (input: string) => {
    // Si el input incluye <MN> se considera un escaneo de pistola y se envía tal cual
    if (input.includes("<MN>")) {
      props.handleScan({ text: input });
    } else {
      // De lo contrario, se considera una carga manual del usuario y se ajusta el formato del texto
      props.handleScan({ text: "idPackage<MN>" + input });
    }

    // Forzar foco en el input después de la acción
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && props.manualInput !== "") {
      e.preventDefault();
      handleScanAction(props.manualInput);
    }
  };

  const handleButtonClick = () => {
    if (props.manualInput !== "") {
      handleScanAction(props.manualInput);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6">
      <QrReaderWrapper
        scanDelay={300}
        onResult={props.handleScan}
        constraints={{ facingMode: "environment" }}
      />
      <div className="flex flex-row gap-2 items-center">
        <GetIcon iconName="load-packages" />
        <Label className="text-xl">Ingrese el código de seguimiento</Label>
      </div>
      <Input
        className="w-full mt-3 bg-[#F9F9F9] rounded-md border-black"
        value={props.manualInput && props.manualInput}
        onChange={handleManualInput}
        onKeyDown={handleKeyDown}
        autoFocus
        disabled={props.disabled}
        ref={inputRef}
      />

      <Button
        variant={"black"}
        color={"green"}
        disabled={props.disabled}
        className="md:w-fit"
        onClick={handleButtonClick}
      >
        Cargar
      </Button>
      {props.readErrorMessage && props.readErrorMessage.length > 1 && (
        <p className="text-xs text-red-500">{props.readErrorMessage}</p>
      )}
      {props.showTotals && (
        <>
          <Separator className="border-t border-[#c8c8c8]" />
          <div className="flex flex-row items-center ">
            <div className=" flex flex-row items-center gap-2 w-[50%]">
              <GetIcon iconName="package-box" className="w-[20px]"></GetIcon>
              <p className="text-normal">
                <span className="font-bold">{props.totals?.packages} </span>
                {props.totals?.packages == 1 ? "Paquete" : "Paquetes"}
              </p>
            </div>
            <div className=" flex flex-row items-center gap-2">
              <GetIcon iconName="bag-icon" className="w-[20px]"></GetIcon>
              <p className="text-normal">
                <span className="font-bold">{props.totals?.bags} </span>
                {props.totals?.bags == 1 ? "Bulto" : "Bultos"}
              </p>
            </div>
          </div>
        </>
      )}
      {props.showDrawer && (
        <Card className="flex flex-col gap-4 justify-center py-4 shadow-none md:h-[180px]">
          <Label className="flex flex-row justify-center gap-3 text-xl">
            <GetIcon iconName="bag-icon" />
            Número de cajón:
          </Label>
          {props.qrRead ? (
            props.showSpinner ? (
              <Loader2 className="self-center mr-2 h-10 w-10 animate-spin md:h-[91px]" />
            ) : props.drawer ? (
              <div className="flex flex-col gap-0">
                <Label className="flex flex-row justify-center text-[48px] ">
                  {props.drawer}
                </Label>
                <Label className="flex flex-row justify-center text-sm ">
                  {"#" + props.qrRead}
                </Label>
              </div>
            ) : (
              <Label className="flex flex-row justify-center text-2xl text-[#AB2F2B] font-semibold leading-[48px] md:h-[90px]">
                No tiene número asignado
              </Label>
            )
          ) : (
            <Label className="flex flex-row justify-center text-[48px] leading-[48px] md:h-[90px]">
              {"-"}
            </Label>
          )}
        </Card>
      )}
    </div>
  );
};

export default ScanPackage;
