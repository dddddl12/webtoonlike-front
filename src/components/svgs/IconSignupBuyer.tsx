import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconSignupBuyer = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={72}
    height={72}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path
      fill="#000"
      d="M12 39.004h9v3h-9v-3Zm0 15h9v-3h-9v3Zm15 0h9v-3h-9v3Zm-15-36h9v-3h-9v3Zm0 12h9v-3h-9v3Zm15 12h9v-3h-9v3Zm0-24h9v-3h-9v3Zm0 12h9v-3h-9v3Zm27 24h6v-3h-6v3Zm0-24h6v-3h-6v3Zm0 12h6v-3h-6v3Zm18-19.5v49.5H0v-64.5c0-4.137 3.366-7.5 7.5-7.5h33c4.134 0 7.5 3.363 7.5 7.5v7.5h16.5c4.134 0 7.5 3.363 7.5 7.5Zm-27-15c0-2.48-2.019-4.5-4.5-4.5h-33a4.505 4.505 0 0 0-4.5 4.5v61.5h42v-61.5Zm24 15c0-2.48-2.019-4.5-4.5-4.5H48v51h21v-46.5Z"
    />
  </svg>
);
