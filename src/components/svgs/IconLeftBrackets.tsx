import * as React from "react";
import type { SVGProps } from "react";

export const IconLeftBrackets = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={20}
    fill="none"
    className={className}
    {...props}
  >
    <path d="M11.885 1.77L10.115 0L0.11499 10L10.115 20L11.885 18.23L3.65499 10L11.885 1.77Z" fill="white"/>
  </svg>
);
