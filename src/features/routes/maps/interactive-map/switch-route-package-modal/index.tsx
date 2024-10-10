import { Button } from "@/components/custom/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Props = {
  data?: any;
  onClose?: () => void;
  onConfirm?: () => void;
};

const SwitchRoutePackageModal = ({
  data,
  onConfirm = () => {},
  onClose = () => {},
}: Props) => {
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Desea cambiar de ruta el paquete?</DialogTitle>
          <DialogDescription>
            Este paquete pertenece a una ruta existente. ¿Desea reasignarlo a la
            ruta actual de todas formas?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button variant={"white"} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={"primary"} onClick={onConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default SwitchRoutePackageModal;
