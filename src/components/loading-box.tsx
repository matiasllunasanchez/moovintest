import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
type Props = {
  text?: string;
  hideLogo?: boolean;
};
const LoadingBox = ({ text = "", hideLogo = false }: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="flex justify-center mb-6">
        {text && <Label color="primary">{text}</Label>}
        {!hideLogo && (
          <Image src="/moovin_logo.png" alt="Logo" width={150} height={50} />
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
      </div>
    </div>
  );
};

export default LoadingBox;
