import { FunctionComponent } from "react";

export const CloseRouteIcon: FunctionComponent<IconProps> = ({
  className,
  mainColor = "#000000",
}) => (
  <svg
    width="37"
    height="36"
    viewBox="0 0 37 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M34.4333 31.3001C34.0999 31.9001 33.65 32.4501 33.15 32.9001C32 33.9668 30.4833 34.6168 28.7999 34.6668C26.3666 34.7168 24.2166 33.4668 23.0333 31.5501C22.4 30.5668 22.0166 29.3835 22 28.1335C21.95 26.0335 22.8833 24.1334 24.3833 22.8834C25.5166 21.9501 26.95 21.3668 28.5166 21.3334C32.2 21.2501 35.25 24.1667 35.3333 27.8501C35.3666 29.1001 35.0333 30.2834 34.4333 31.3001Z"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.0667 28.0501L27.75 29.65L31.2333 26.2833"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.28345 10.3999L17.0001 18.9165L31.6167 10.4498"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 34.0166V18.8999"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.0167 22.7167C33.0167 22.8001 33.0167 22.8667 33.0001 22.95C31.8334 21.9333 30.3334 21.3334 28.6667 21.3334C27.1 21.3334 25.65 21.8834 24.5 22.8C22.9667 24.0167 22 25.9 22 28C22 29.25 22.35 30.4334 22.9667 31.4334C23.1167 31.7 23.3 31.9501 23.5 32.1834L20.4501 33.8667C18.5501 34.9334 15.45 34.9334 13.55 33.8667L4.65003 28.9334C2.63337 27.8167 0.983398 25.0167 0.983398 22.7167V13.2833C0.983398 10.9833 2.63337 8.18338 4.65003 7.06671L13.55 2.13334C15.45 1.06668 18.5501 1.06668 20.4501 2.13334L29.35 7.06671C31.3667 8.18338 33.0167 10.9833 33.0167 13.2833V22.7167Z"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
