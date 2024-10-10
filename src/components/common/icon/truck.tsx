import { FunctionComponent } from "react";

export const TruckIcon: FunctionComponent<IconProps> = ({
  className,
  mainColor = "#000000",
}) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 23.3333H21.6667C23.5 23.3333 25 21.8333 25 20V3.33334H10C7.5 3.33334 5.31668 4.71666 4.18335 6.74999"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33337 28.3333C3.33337 31.1 5.56671 33.3333 8.33337 33.3333H10C10 31.5 11.5 30 13.3334 30C15.1667 30 16.6667 31.5 16.6667 33.3333H23.3334C23.3334 31.5 24.8334 30 26.6667 30C28.5 30 30 31.5 30 33.3333H31.6667C34.4334 33.3333 36.6667 31.1 36.6667 28.3333V23.3333H31.6667C30.75 23.3333 30 22.5833 30 21.6667V16.6667C30 15.75 30.75 15 31.6667 15H33.8167L30.9667 10.0167C30.3667 8.98336 29.2668 8.33334 28.0668 8.33334H25V20C25 21.8333 23.5 23.3333 21.6667 23.3333H20"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.3333 36.6667C11.4924 36.6667 10 35.1743 10 33.3333C10 31.4924 11.4924 30 13.3333 30C15.1743 30 16.6667 31.4924 16.6667 33.3333C16.6667 35.1743 15.1743 36.6667 13.3333 36.6667Z"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.6667 36.6667C24.8258 36.6667 23.3334 35.1743 23.3334 33.3333C23.3334 31.4924 24.8258 30 26.6667 30C28.5077 30 30 31.4924 30 33.3333C30 35.1743 28.5077 36.6667 26.6667 36.6667Z"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36.6667 23.3333H31.6667C30.75 23.3333 30 22.5833 30 21.6667V16.6667C30 15.75 30.75 15 31.6667 15H33.8166L36.6667 20V23.3333Z"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33337 13.3333H13.3334"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33337 18.3333H10"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33337 23.3333H6.66671"
      stroke={mainColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
