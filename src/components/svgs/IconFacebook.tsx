import { cn } from "@/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconFacebook = ({
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
