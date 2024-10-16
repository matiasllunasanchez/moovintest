import { FunctionComponent } from "react";

export const MapIcon: FunctionComponent<IconProps> = ({
  className,
  mainColor = "#000000",
}) => (
  <svg
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 256 256"
    enableBackground="new 0 0 256 256"
    className={className}
  >
    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
    <g>
      <g>
        <g>
          <path
            fill={mainColor}
            d="M93.4,4.6c-1.1,0.3-19.6,12.3-41.1,26.6L13.2,57.3l-1.6,3.1L10,63.6l0.1,90.2l0.2,90.2l1.7,2.5c3.3,4.6,8.1,6.6,13,5.4c1.3-0.3,16.4-10,36.5-23.4c18.8-12.6,34.4-22.9,34.6-22.9c0.2,0,12.9,10,28.1,22.2c15.2,12.2,28.7,22.7,30,23.3c2.7,1.3,6,1.4,8.6,0.3c3.5-1.5,78.2-51.5,80.1-53.6c1.2-1.3,2-3.1,2.4-5.2c0.5-2.2,0.6-28.9,0.5-91.4l-0.2-88.3l-1.6-2.6c-3.1-5.4-9.4-7.8-14.6-5.6c-1,0.4-17,10.8-35.3,23c-18.4,12.2-33.7,22.4-34.1,22.6c-0.4,0.2-13.5-9.9-29.1-22.4C99.4,2.5,99.8,2.8,93.4,4.6z M84.6,111.6v72.1L60,200.2c-13.6,9-24.8,16.4-25.1,16.4c-0.2,0-0.4-32.5-0.4-72.2V72.2l24.6-16.4c13.6-9,24.8-16.4,25.1-16.4C84.4,39.4,84.6,71.9,84.6,111.6z M221.6,111.5l-0.1,72.2L197.1,200c-13.5,9-24.8,16.4-25.1,16.5c-0.3,0.1-0.5-29.7-0.5-72V72.2l24.7-16.4c13.5-9,24.8-16.4,25.1-16.4C221.4,39.4,221.6,71.9,221.6,111.5z M129.1,57.5L147,71.8v71.3c0,56.9-0.2,71.2-0.7,70.9c-0.4-0.2-9-7-18.9-15l-18.2-14.6V113c0-69.1,0.1-71.4,1-70.6C110.7,42.9,119.3,49.6,129.1,57.5z"
          />
        </g>
      </g>
    </g>
  </svg>
);
