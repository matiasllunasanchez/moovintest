import React from "react";
import { GetIcon } from "@/components/common/icon";
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import Modal from "../modal";

type Props = {
  errorMessage: string;
  onClose: () => void;
};

const ScanErrorModal: React.FC<Props> = ({ errorMessage, onClose }) => {
  return (
    <Modal isOpen={!!errorMessage} onClose={onClose}>
      <div className="flex flex-col md:w-[30vw]">
        <Label className="flex flex-row items-center gap-2 text-lg">
          <GetIcon iconName="bag-icon" />
          Lectura de Código
        </Label>

        <Label className="p-6 text-center text-md">
          <Label className="text-center text-md text-red-800">
            Ha ocurrido un error <br />
          </Label>
          {errorMessage}
        </Label>
        <Button onClick={onClose} variant={"red"}>
          Aceptar
        </Button>
      </div>
    </Modal>
  );
};

export default ScanErrorModal;
