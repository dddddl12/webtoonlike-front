import { cn } from "@/lib/utils";
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
    className={cn(className)}
    {...props}
  >
    <path
      d="m17.885 4.27-1.77-1.77-10 10 10 10 1.77-1.77-8.23-8.23 8.23-8.23Z"
    />
  </svg>
);
