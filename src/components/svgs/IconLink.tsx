import * as React from "react";
import type { SVGProps } from "react";

export const IconLink = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={11}
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M15 0.5H11V2.5H15C16.65 2.5 18 3.85 18 5.5C18 7.15 16.65 8.5 15 8.5H11V10.5H15C17.76 10.5 20 8.26 20 5.5C20 2.74 17.76 0.5 15 0.5ZM9 8.5H5C3.35 8.5 2 7.15 2 5.5C2 3.85 3.35 2.5 5 2.5H9V0.5H5C2.24 0.5 0 2.74 0 5.5C0 8.26 2.24 10.5 5 10.5H9V8.5ZM6 4.5H14V6.5H6V4.5Z"
      fill="white"/>
  </svg>
);
