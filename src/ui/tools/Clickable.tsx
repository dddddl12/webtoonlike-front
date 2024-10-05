import {
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface ClicakbleProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Clickable({ className, ...props }: ClicakbleProps) {
  return (
    <div
      className={cn(
        "cursor-pointer hover:bg-gray-500 hover:bg-opacity-10",
        className
      )}
      {...props}
    />
  );
}