import { Button, buttonVariants } from "@/components/custom/button";
import { MOOVIN_URLS } from "@/utils/urls";
import Link from "next/link";

const ShortCuts = () => {
  return (
    <div className="flex flex-col items-center md:flex-row !justify-center gap-8 mb-2">
      <Link
        href={MOOVIN_URLS.PACKAGES.SCAN_PACKAGES}
        className="w-full md:w-[200px]"
      >
        <Button
          className="w-full md:w-[200px] h-[150px] bg-white  "
          iconName="load-packages"
          variant={"white"}
          size={"square"}
          isIconBig
        >
          Ingresar paquetes
        </Button>
      </Link>
      <Link href={MOOVIN_URLS.ROUTES.NEW_ROUTE} className="w-full md:w-[200px]">
        <Button
          className="w-full md:w-[200px] h-[150px]"
          iconName="truck-icon"
          variant={"white"}
          size={"square"}
          isIconBig
        >
          Crear ruta
        </Button>
      </Link>
      <Link href={MOOVIN_URLS.ROUTES.CLOSURE} className="w-full md:w-[200px]">
        <Button
          className="w-full md:w-[200px] h-[150px] bg-white"
          iconName="close-route-icon"
          variant={"white"}
          size={"square"}
          isIconBig
        >
          Cierre de ruta
        </Button>
      </Link>
    </div>
  );
};

export default ShortCuts;
