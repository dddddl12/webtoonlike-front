import * as React from "react";
import type { SVGProps } from "react";

export const IconAlbum = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    className={className}
    {...props}
  >
    <path d="M18 2v12H6V2h12Zm0-2H6C4.9 0 4 .9 4 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2ZM9.5 9.67l1.69 2.26 2.48-3.1L17 13H7l2.5-3.33ZM0 4v14c0 1.1.9 2 2 2h14v-2H2V4H0Z" />
  </svg>
);
