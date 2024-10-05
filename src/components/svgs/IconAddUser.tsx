import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconAddUser = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={16}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path d="M14 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2Zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H8Zm-3-3V8h3V6H5V3H3v3H0v2h3v3h2Z"/>
  </svg>
);
