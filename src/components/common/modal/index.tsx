import classNames from "classnames";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthAuto?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  widthAuto = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={classNames(
          "absolute p-6 bg-white rounded-lg shadow-lg  max-h-screen overflow-auto",
          !widthAuto && "max-w-[90%]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
