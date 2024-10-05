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
    <path
      d="M.115 18.23 1.885 20l10-10-10-10-1.77 1.77L8.345 10l-8.23 8.23Z"
    />
  </svg>
);
