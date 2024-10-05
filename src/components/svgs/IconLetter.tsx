import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconLetter = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={16}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path d="M20 2c0-1.1-.9-2-2-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2Zm-2 0-8 4.99L2 2h16Zm0 12H2V4l8 5 8-5v10Z" />
  </svg>
);
