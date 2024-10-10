import React from "react";
import { Button } from "@/components/custom/button";

type Props = {
  phoneNumber: string;
  message?: string;
  buttonText?: string;
};

const WhatsAppContactButton = ({
  phoneNumber,
  message = "",
  buttonText = "Contactar",
}: Props) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      iconName="whatsapp"
      iconColor="green"
      variant={"white"}
    >
      {buttonText}
    </Button>
  );
};

export default WhatsAppContactButton;
