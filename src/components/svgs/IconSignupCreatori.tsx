import { cn } from "@/components/ui/lib/utils";
import * as React from "react";
import type { SVGProps } from "react";

export const IconSignupCreator = ({
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
    <g clipPath="url(#a)">
      <path
        fill="#000"
        d="M24 36.004c9.927 0 18-8.073 18-18s-8.073-18-18-18-18 8.073-18 18 8.073 18 18 18Zm0-33c8.271 0 15 6.73 15 15 0 8.271-6.729 15-15 15s-15-6.729-15-15c0-8.27 6.729-15 15-15Zm24 54v15h-3v-15c0-6.618-5.382-12-12-12H15c-6.618 0-12 5.382-12 12v15H0v-15c0-8.27 6.729-15 15-15h18c8.271 0 15 6.73 15 15Zm23.946-29.48-15.999 16.05A4.868 4.868 0 0 1 52.497 45a4.856 4.856 0 0 1-3.447-1.428l-9.435-9.435 2.121-2.12 9.435 9.434c.708.708 1.947.711 2.655 0l15.999-16.05 2.124 2.118-.003.003Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .004h72v72H0z" />
      </clipPath>
    </defs>
  </svg>
);
