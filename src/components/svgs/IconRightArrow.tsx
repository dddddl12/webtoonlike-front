import { cn } from "@/components/ui/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconRightArrow = ({
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
      d="M8 0 6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8-8-8Z"
    />
  </svg>
);
