import * as React from "react";
import type { SVGProps } from "react";

export const IconUpArrow = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="m0 8 1.41 1.41L7 3.83V16h2V3.83l5.58 5.59L16 8 8 0 0 8Z"
    />
  </svg>
);
