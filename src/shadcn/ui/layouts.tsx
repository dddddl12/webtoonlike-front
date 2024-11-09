import React, {
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import { cn } from "@/shadcn/lib/utils";


interface GapProps {
  x?: number|string
  y?: number|string
}

export function Gap({ x, y }: GapProps): JSX.Element {
  if (x) {
    if (typeof x === "number") {
      return <div style={{ width: `${x * 4}px` }} />;
    } else {
      return <div style={{ width: x }} />;
    }
  } else if (y) {
    if (typeof y === "number") {
      return <div style={{ height: `${y * 4}px` }} />;
    } else {
      return <div style={{ height: y }} />;
    }
  } else {
    return <></>;
  }
}

interface BoxProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Box({ className, ...props }: BoxProps) {
  return (
    <div className={cn("flex flex-row justify-center items-center", className)} {...props} />
  );
}

interface RowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Row({ className, ...props }: RowProps) {
  return (
    <div className={cn("flex flex-row items-center", className)} {...props} />
  );
}


interface ColProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Col({ className, ...props }: ColProps) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}


interface ContainerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("container mx-auto max-w-[1280px] pt-2 md:pt-4", className)}
      {...props}
    />
  );
}


interface GridProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Grid({ className, ...props }: GridProps) {
  return (
    <div
      className={cn("grid", className)}
      {...props}
    />
  );
}