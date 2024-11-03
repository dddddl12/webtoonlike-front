import { ReactNode } from "react";
import { clsx } from "clsx";

export default function PageLayout({ children, bgColor, className }: {
  children: ReactNode;
  bgColor?: "dark" | "light";
  className?: string;
}) {
  return <div className={clsx("flex justify-center w-full pt-10 pb-24 px-10", {
    "bg-black text-white": bgColor !== "light",
  })}>
    {/*TODO 불필요한 text-white 제거*/}
    <div className={clsx(className, "max-w-screen-xl w-full")}>{children}</div>
  </div>;
}