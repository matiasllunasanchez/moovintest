"use-client";
import { Row } from "@tanstack/react-table";
import { packageSchema } from "../schema";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/custom/button";
import DetailModal from "../../detail-modal";
import { GetPackageInfo } from "@/app/actions";
import { useEffect, useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function ActionColumn<TData>({ row }: DataTableRowActionsProps<TData>) {
  const packageItem = packageSchema.parse(row.original);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [lastPackage, setLastPackage] = useState<MoovinPackage | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleGetPackageInfo = (id: string) => {
    callBack(id);
    setIsModalOpen(true); // Abrimos el modal
  };

  const callBack = async (id: string) => {
    await GetPackageInfo(id).then((res: any) => {
      setLastPackage(res);
    });
  };

  // Limpia los datos cuando el modal se cierra
  useEffect(() => {
    if (!isModalOpen) {
      setLastPackage(undefined);
      setShowInfo(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (Number(packageItem.id) === lastPackage?.body.idPackage) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [lastPackage?.body, packageItem.id]);

  return (
    <>
      <div className="flex flex-row gap-2 justify-end">
        <DialogTrigger asChild>
          <Button
            variant="black"
            onClick={() => handleGetPackageInfo(packageItem.id)}
          >
            Detalle
          </Button>
        </DialogTrigger>
      </div>
      {isModalOpen && lastPackage && showInfo && (
        <DetailModal
          data={lastPackage}
          onClose={() => setIsModalOpen(false)} // Cierra el modal y limpia el estado
        />
      )}
    </>
  );
}
