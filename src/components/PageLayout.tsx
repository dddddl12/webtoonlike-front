import { ReactNode } from "react";
import { clsx } from "clsx";

export default function PageLayout({ children, bgColor, className }: {
  children: ReactNode;
  bgColor?: "dark" | "light";
  className?: string;
}) {
  return <div className={clsx("flex justify-center w-full pt-10 pb-24 px-10", {
    "bg-black": bgColor !== "light",
  })}>
    <div className={clsx(className, "max-w-screen-xl w-full")}>{children}</div>
  </div>;
}