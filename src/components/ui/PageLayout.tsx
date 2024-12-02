import { ReactNode } from "react";
import { clsx } from "clsx";

export default function PageLayout({ children, className }: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("flex w-full pt-10 pb-24 px-10 justify-center")}>
    <div className={clsx(className, "max-w-screen-xl w-full flex flex-col")}>
      {children}
    </div>
  </div>;
}