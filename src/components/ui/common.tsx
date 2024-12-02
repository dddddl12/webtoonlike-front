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

export function HR({ className, ...props }: React.HTMLProps<HTMLHRElement>) {
  return <hr {...props} className={clsx("border-gray-dark my-10", className)} />;
}

interface HeadingProps extends React.HTMLProps<HTMLHeadingElement> {}

export function Heading1({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={clsx("font-bold text-3xl mb-10",
        "[&:not(:first-child)]:mt-16", className)}
      {...props}
    />
  );
}

export function Heading2({ className, ...props }: HeadingProps) {
  return (
    <h2
      className={clsx("font-bold text-2xl mb-6",
        "[&:not(:first-child)]:mt-16", className)}
      {...props}
    />
  );
}

export function Heading3({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={clsx("font-bold text-xl mb-4",
        "[&:not(:first-child)]:mt-10", className)}
      {...props}
    />
  );
}