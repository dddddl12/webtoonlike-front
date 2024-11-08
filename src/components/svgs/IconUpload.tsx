import { cn } from "@/components/ui/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconUpload = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={65}
    height={43}
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path
      d="M52.406 16.233C50.565 6.96 42.358 0 32.5 0a20.32 20.32 0 0 0-18.01 10.857C6.338 11.717 0 18.572 0 26.876 0 35.771 7.285 43 16.25 43h35.208C58.933 43 65 36.98 65 29.562c0-7.095-5.552-12.846-12.594-13.33Zm-.948 21.392H16.25c-5.985 0-10.833-4.81-10.833-10.75 0-5.51 4.143-10.105 9.641-10.67l2.898-.295 1.354-2.553A14.825 14.825 0 0 1 32.5 5.375c7.096 0 13.217 4.999 14.598 11.906l.812 4.03 4.144.297c4.225.268 7.53 3.789 7.53 7.954 0 4.435-3.657 8.063-8.126 8.063ZM21.667 24.187h6.906v8.063h7.854v-8.063h6.906L32.5 13.438l-10.833 10.75Z"
    />
  </svg>
);
