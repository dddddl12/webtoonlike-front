import React, {
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import { clsx } from "clsx";

interface RowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Row({ className, ...props }: RowProps) {
  return (
    <div className={clsx("flex flex-row items-center", className)} {...props} />
  );
}


interface ColProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Col({ className, ...props }: ColProps) {
  return <div className={clsx("flex flex-col", className)} {...props} />;
}


// todo tailwind 공통 서식으로 대체
interface HeadingProps extends React.HTMLProps<HTMLHeadingElement> {}

export function Heading1({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={clsx("font-bold text-3xl flex mb-10",
        "[&:not(:first-child)]:mt-16", className)}
      {...props}
    />
  );
}

export function Heading2({ className, ...props }: HeadingProps) {
  return (
    <h2
      className={clsx("font-bold text-2xl flex mb-10",
        "[&:not(:first-child)]:mt-16", className)}
      {...props}
    />
  );
}