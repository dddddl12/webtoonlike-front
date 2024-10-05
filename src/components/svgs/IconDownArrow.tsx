import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconDownArrow = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path
      d="m16 8-1.41-1.41L9 12.17V0H7v12.17L1.42 6.58 0 8l8 8 8-8Z"
    />
  </svg>
);
