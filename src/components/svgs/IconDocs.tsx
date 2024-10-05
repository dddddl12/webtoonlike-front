import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconDocs = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6Zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H8V4h12v12ZM10 9h8v2h-8V9Zm0 3h4v2h-4v-2Zm0-6h8v2h-8V6Z" />
  </svg>
);
