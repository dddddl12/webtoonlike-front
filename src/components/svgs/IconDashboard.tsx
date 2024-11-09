import * as React from "react";
import type { SVGProps } from "react";

export const IconDashboard = ({
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
    <path d="M0 0v8h8V0H0Zm6 6H2V2h4v4Zm-6 4v8h8v-8H0Zm6 6H2v-4h4v4Zm4-16v8h8V0h-8Zm6 6h-4V2h4v4Zm-6 4v8h8v-8h-8Zm6 6h-4v-4h4v4Z" />
  </svg>
);
