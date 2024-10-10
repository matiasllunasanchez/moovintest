import { FunctionComponent } from "react";

export const DotIcon: FunctionComponent<IconProps> = ({
  className,
  mainColor,
}) => (
  <svg
    width="8"
    height="9"
    viewBox="0 0 8 9"
    fill={mainColor}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect y="0.5" width="8" height="8" rx="4" fill="#B1302F" />
  </svg>
);
