import { ReactNode } from "react";
import { clsx } from "clsx";

export default function PageLayout({ children, lightTheme = false, className }: {
  children: ReactNode;
  lightTheme?: boolean;
  className?: string;
}) {
  return <div className={clsx("flex w-full pt-10 pb-24 px-10 justify-center", {
    "light bg-background text-primary": lightTheme
  })}>
    {/*TODO 불필요한 text-white 제거*/}
    <div className={clsx(className, "max-w-screen-xl w-full flex flex-col")}>
      {children}
    </div>
  </div>;
}