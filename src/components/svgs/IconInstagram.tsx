import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconInstagram = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    width={40}
    height={40}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill="none"
    className={cn(className)}
    {...props}
  >
    <path fill="url(#a)" d="M0 0h40v40H0z" />
    <defs>
      <pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#b" transform="scale(.00806)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="b"
        width={124}
        height={124}
      />
    </defs>
  </svg>
);
