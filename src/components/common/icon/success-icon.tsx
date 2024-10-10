import { FunctionComponent } from "react";

export const SuccessIcon: FunctionComponent<{
  className?: string;
  mainColor?: string;
}> = ({ className, mainColor = "#000000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
    stroke={mainColor}
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
