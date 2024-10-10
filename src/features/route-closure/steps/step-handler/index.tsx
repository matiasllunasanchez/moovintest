import { Button } from "@/components/custom/button";
import classNames from "classnames";

type props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  stepStatus: boolean[];
  handleCloseRoute: () => void;
};

const StepHandler: React.FC<props> = ({
  setStep,
  step,
  stepStatus,
  handleCloseRoute,
}) => {
  return (
    // <div className={classNames("absolute bottom-0 w-[95vw]")}>.
    <div className={classNames("mt-auto")}>
      <div className=" flex flex-row justify-between relative bottom-0 pb-4 px-0 ">
        <Button onClick={() => setStep(step - 1)} disabled={step == 1}>
          Volver
        </Button>
        {step != 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={stepStatus[step - 1] === false}
          >
            Continuar
          </Button>
        ) : (
          <Button onClick={handleCloseRoute}>Finalizar</Button>
        )}
      </div>
    </div>
  );
};

export default StepHandler;
