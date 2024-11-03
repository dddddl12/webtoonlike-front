import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconRightBrackets = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={20}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path d="M0.115009 18.23L1.88501 20L11.885 10L1.88501 -8.74228e-07L0.115011 1.77L8.34501 10L0.115009 18.23Z"
      fill="white"/>
  </svg>
);
