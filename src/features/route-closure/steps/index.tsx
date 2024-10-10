"use client";
import { CloseRoute, GetRouteDetail } from "@/app/actions";
import Modal from "@/components/common/modal";
import { Button } from "@/components/custom/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MOOVIN_URLS } from "@/utils/urls";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StepHandler from "./step-handler";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";

const RouteClosureStepsContainer = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const [route, setRoute] = useState<RouteDetail>();

  //packages step
  const [noPackages, setNoPackages] = useState<boolean>(false);
  const [qrToProcess, setQrToProcess] = useState<
    PackageInfoForClosureWithStatus[]
  >([]);
  //cash step
  const [finalCashReceived, setFinalCashReceived] = useState<{
    cashColon: number;
    cashDollars: number;
  }>({ cashColon: 0, cashDollars: 0 });
  //docs step
  const [docsRecieveCheck, setDocsRecieveCheck] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [closeRouteResult, setCloseRouteResult] =
    useState<CloseRouteResponse>();
  const [step, setStep] = useState<number>(1);
  const [stepStatus, setStepStatus] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  useEffect(() => {
    setStepStatus((prevState) => {
      const newStepsStatus = [...prevState];
      newStepsStatus[2] = docsRecieveCheck;
      return newStepsStatus;
    });
  }, [docsRecieveCheck]);

  const router = useRouter();

  const handleGetRouteDetails = useCallback(
    (routeId: string) => {
      GetRouteDetail(Number(routeId)).then((res: RouteDetailResponse) => {
        setRoute(res.body);
      });
    },
    [routeId, step]
  );

  // Obtén la altura disponible cuando el componente se monta
  const availableHeight =
    typeof window !== "undefined" ? window.innerHeight : 0;

  useEffect(() => {
    handleGetRouteDetails(routeId);
  }, [routeId, qrToProcess]);

  const handleBack = () => {
    step === 1 ? router.back() : setStep(step - 1);
  };

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
  const handleCloseRoute = async () => {
    const closeRouteReq: CloseRouteReq = {
      idRoute: route?.idRoute || 0,
      documents:
        route?.documents.map((doc) => ({
          idDocumentXPackage: doc.idDocumentXPackage,
          idPackage: doc.idPackage,
          idFieldOfDocument: doc.idFieldOfDocument,
        })) || [],
      totalMoneyRoute:
        (route?.payments.cashColon || 0) + (route?.payments.cashDollars || 0),
      collectedMoneyRoute:
        finalCashReceived.cashColon + finalCashReceived.cashDollars,
    };
    try {
      route &&
        (await CloseRoute(closeRouteReq).then((res: CloseRouteResponse) => {
          if (res.status == "OK") {
            showSuccessProcess("Ruta cerrada correctamente.");
            router.push(MOOVIN_URLS.ROUTES.CLOSURE);
          } else if (res.body.hasError) {
            setCloseRouteResult(res);
            setShowModal(true);
          } else {
            showErrorProcess(res.body.message);
          }
        }));
    } catch (error: any) {
      showErrorProcess("Se produjo el siguiente error: " + error);
    }
  };

  const renderStepComponent = (route: RouteDetail) => {
    switch (step) {
      case 1:
        return (
          <Step1
            route={route}
            qrToProcess={qrToProcess}
            setQrToProcess={setQrToProcess}
            setStepStatus={setStepStatus}
            noPackages={noPackages}
            setNoPackages={setNoPackages}
          />
        ); // Paso 1
      case 2:
        return (
          <Step2
            route={route}
            setStepStatus={setStepStatus}
            finalCashReceived={finalCashReceived}
            setFinalCashReceived={setFinalCashReceived}
          />
        ); // Paso 2
      case 3:
        return (
          <Step3
            route={route}
            setStepStatus={setStepStatus}
            docsRecieveCheck={docsRecieveCheck}
            setDocsRecieveCheck={setDocsRecieveCheck}
          />
        ); // Paso 3
      case 4:
        return <Step4 route={route} finalCashReceived={finalCashReceived} />; // Paso 4
      default:
        return (
          <Step1
            route={route}
            qrToProcess={qrToProcess}
            setQrToProcess={setQrToProcess}
            setStepStatus={setStepStatus}
            noPackages={noPackages}
            setNoPackages={setNoPackages}
          />
        ); // Paso por defecto, puede ser el primer paso
    }
  };

  return (
    <div className="flex flex-col b-0 min-h-[85vh]">
      <Button
        onClick={handleBack}
        iconName="arrow-back"
        iconClassName="fill-[#64748B] rotate-90 h-[8px]"
        variant={"ghost"}
        className="text-[#64748B] justify-start absolute  !px-0 md:!px-4"
      >
        Volver
      </Button>
      <div className="mt-10 sm:mt-10 md:mt-0 md:max-w-[450px] w-full self-center pt-[8px] flex flex-col flex-grow gap-4">
        <p className="text-[#64748B] justify-start">Paso {step} de 4.</p>
        <Label className="text-[#102833] text-[32px] font-semibold">
          Cierre de ruta
        </Label>
        <Card
        // className="overflow-auto"
        // style={{ maxHeight: availableHeight - 330 }}
        >
          {route !== undefined && renderStepComponent(route)}
        </Card>
        <StepHandler
          setStep={setStep}
          step={step}
          stepStatus={stepStatus}
          handleCloseRoute={handleCloseRoute}
        />
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
        <div className="flex flex-col gap-4 ">
          <Label className="text-lg mr-4 max-w-[600px] pb-2 border-b border-slate-200">
            {closeRouteResult?.message}
          </Label>
          {closeRouteResult?.body.pendingPackages &&
            closeRouteResult?.body.pendingPackages.length > 0 && (
              <div className="flex flex-col pt-4 ">
                <Label className="text-md mb-2">
                  Entregas con estado incorrecto:
                </Label>
                <div className="grid grid-cols-3 bg-[#F0F0F080] text-[16px] py-2 px-2 ">
                  <Label className="text-md text-[#64748B]">ID</Label>
                  <Label className="text-md text-[#64748B]">Perfil</Label>
                  <Label className="text-md text-[#64748B]">Estado</Label>
                </div>
                {closeRouteResult.body.pendingPackages.map((qr) => (
                  <div
                    className="grid grid-cols-3 text-md py-2 last:pb-0 px-2 border-t border-slate-200 text-[#0F172A]"
                    key={qr.idPackage}
                  >
                    <Label className="text-md font-normal">
                      #{qr.idPackage}
                    </Label>
                    <Label className="text-md  font-normal">
                      {qr.profileName}
                    </Label>
                    <Label className="text-md  font-normal">
                      {qr.statusTranslate}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          {closeRouteResult?.body.pendingPackagesCollect &&
            closeRouteResult?.body.pendingPackagesCollect.length > 0 && (
              <div className="flex flex-col pt-4 ">
                <Label className="text-md mb-2">
                  Recolecciones con estado incorrecto:
                </Label>
                <div className="grid grid-cols-3 bg-[#F0F0F080] text-[16px] py-2 px-2 ">
                  <Label className="text-md text-[#64748B]">ID</Label>
                  <Label className="text-md text-[#64748B]">Perfil</Label>
                  <Label className="text-md text-[#64748B]">Estado</Label>
                </div>
                {closeRouteResult.body.pendingPackagesCollect.map((qr) => (
                  <div
                    className="grid grid-cols-3 text-md py-2 last:pb-0 px-2 border-t border-slate-200 text-[#0F172A]"
                    key={qr.idPackage}
                  >
                    <Label className="text-md font-normal">
                      #{qr.idPackage}
                    </Label>
                    <Label className="text-md  font-normal">
                      {qr.profileName}
                    </Label>
                    <Label className="text-md  font-normal">
                      {qr.statusTranslate}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          <div className="flex justify-end gap-2 pt-4 mt-4 ">
            <Button
              onClick={() => {
                setShowModal(false);
              }}
              variant="white"
              className="w-fit "
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
                setStep(1);
                setNoPackages(false);
              }}
              className="w-fit "
            >
              Ir a devolución de paquetes
            </Button>
          </div>
        </div>
      </Modal>
      {/* <StepHandler
        setStep={setStep}
        step={step}
        stepStatus={stepStatus}
        handleCloseRoute={handleCloseRoute}
      /> */}
    </div>
  );
};

export default RouteClosureStepsContainer;
