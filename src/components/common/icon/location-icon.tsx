import { FunctionComponent } from "react";

export const LocationIcon: FunctionComponent<IconProps> = ({
  className,
  mainColor = "#929AB5",
}) => (
  <svg
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.9999 17.9299C14.2768 17.9299 12.8799 16.5331 12.8799 14.8099C12.8799 13.0868 14.2768 11.6899 15.9999 11.6899C17.723 11.6899 19.1199 13.0868 19.1199 14.8099C19.1199 16.5331 17.723 17.9299 15.9999 17.9299Z"
      stroke={mainColor}
      strokeWidth="1.5"
    />
    <path
      d="M24.38 13C25.53 18.08 22.37 22.38 19.6 25.04C17.59 26.98 14.41 26.98 12.39 25.04C9.62995 22.38 6.46995 18.07 7.61995 12.99C9.58995 4.33 22.42 4.34 24.38 13Z"
      stroke={mainColor}
      strokeWidth="1.5"
    />
  </svg>
);
