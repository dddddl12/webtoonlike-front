import { ReactNode } from "react";
import { clsx } from "clsx";

export default function PageLayout({ children, bgColor = "dark", className }: {
  children: ReactNode;
  bgColor?: "dark" | "light";
  className?: string;
}) {
  return <div className={clsx("flex w-full pt-10 pb-24 px-10 justify-center", {
    "bg-black text-white": bgColor === "dark"
  })}>
    {/*TODO 불필요한 text-white 제거*/}
    <div className={clsx(className, "max-w-screen-xl w-full flex flex-col")}>
      {children}
    </div>
  </div>;
}