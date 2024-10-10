import { FunctionComponent } from "react";

export const PackageBox: FunctionComponent<IconProps> = ({
  className,
  mainColor = "#000000",
}) => (
  <svg
    width="34"
    height="35"
    viewBox="0 0 34 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2.28345 9.8999L17.0001 18.4166L31.6168 9.9499"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 33.5167V18.4001"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.65007 6.56673C2.6334 7.68339 0.983398 10.4834 0.983398 12.7834V22.2001C0.983398 24.5001 2.6334 27.3001 4.65007 28.4167L13.5501 33.3667C15.4501 34.4167 18.5667 34.4167 20.4667 33.3667L29.3667 28.4167C31.3834 27.3001 33.0334 24.5001 33.0334 22.2001V12.7834C33.0334 10.4834 31.3834 7.68339 29.3667 6.56673L20.4667 1.61673C18.5501 0.566728 15.4501 0.566728 13.5501 1.63339L4.65007 6.56673Z"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
