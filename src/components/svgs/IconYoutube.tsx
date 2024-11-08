import { cn } from "@/components/ui/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconYoutube = ({
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
