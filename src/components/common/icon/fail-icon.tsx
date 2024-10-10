import { FunctionComponent } from "react";

export const FailIcon: FunctionComponent<{
  className?: string;
  mainColor?: string;
}> = ({ className, mainColor = "#000000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
    viewBox="0 0 24 24"
    stroke={mainColor}
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
