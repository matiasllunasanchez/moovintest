import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
type props = {
  route: RouteDetail;
  setStepStatus: React.Dispatch<React.SetStateAction<boolean[]>>;
  docsRecieveCheck: boolean;
  setDocsRecieveCheck: React.Dispatch<React.SetStateAction<boolean>>;
};

const RouteClosureStep2: React.FC<props> = ({
  route,
  setStepStatus,
  docsRecieveCheck,
  setDocsRecieveCheck,
}) => {
  useEffect(() => {
    route.documents.length === 0 &&
      setStepStatus((prevState) => {
        const newStepsStatus = [...prevState];
        newStepsStatus[2] = true;
        return newStepsStatus;
      });
  }, []);
  return (
    <div className="flex flex-col p-6 gap-4">
      <Label className="text-xl">Recepción de documentos</Label>
      <Label className="text-md text[#64748B] font-light">
        Listado de documentos:
      </Label>
      <>
        {route.documents.length > 0 ? (
          <div>
            <div className="grid grid-cols-3 bg-[#F0F0F080] text-[16px] py-4 px-2 ">
              <Label className="text-md text-[#64748B]">ID</Label>
              <Label className="text-md text-[#64748B]">Perfil</Label>
              <Label className="text-md text-[#64748B]">Descripción</Label>
            </div>
            {route.documents.map((doc) => {
              return (
                <div
                  className="grid grid-cols-3 text-md py-4 last:pb-0 px-2 border-t border-slate-200 text-[#0F172A]"
                  key={doc.idPackage}
                >
                  <Label>#{doc.idPackage}</Label>
                  <Label>{doc.profileName}</Label>
                  <Label>{doc.description}</Label>
                </div>
              );
            })}
          </div>
        ) : (
          <Label>Sin documentos</Label>
        )}
      </>

      <Separator className="my-2" />
      <Label className="text-md text[#64748B] font-light">Recepción:</Label>
      <Label className="flex align-middle">
        <Checkbox
          checked={docsRecieveCheck}
          className="mr-2"
          disabled={route.documents.length === 0}
          onClick={() => setDocsRecieveCheck(!docsRecieveCheck)}
        ></Checkbox>
        Recibido
      </Label>
    </div>
  );
};

export default RouteClosureStep2;
