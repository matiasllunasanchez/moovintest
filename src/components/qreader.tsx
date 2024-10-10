"use-client";
import React from "react";
import { QrReader, QrReaderProps } from "react-qr-reader";

interface QrReaderWrapperProps extends QrReaderProps {}

const QrReaderWrapper: React.FC<QrReaderWrapperProps> = (props) => {
  return (
    <div className="relative w-full ">
      <QrReader {...props} className="rounded-xl md:hidden " />
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none md:hidden">
        <div className="w-[70%] h-40 border-4 border-red-500 rounded-md"></div>
      </div>
    </div>
  );
};

export default QrReaderWrapper;
