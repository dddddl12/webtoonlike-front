import * as React from "react";
import type { SVGProps } from "react";

export const IconTimer = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={22}
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M12.5.5h-6v2h6v-2Zm-4 13h2v-6h-2v6Zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 9.5 3.5a9 9 0 0 0-9 9c0 4.97 4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61ZM9.5 19.5c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7Z"
    />
  </svg>
);
