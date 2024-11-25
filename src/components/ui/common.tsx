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

export function Heading({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={clsx("font-bold text-3xl mb-10 flex", className)}
      {...props}
    />
  );
}

export function Heading2({ className, ...props }: HeadingProps) {
  return (
    <h2
      className={clsx("font-bold text-2xl mb-10 flex", className)}
      {...props}
    />
  );
}