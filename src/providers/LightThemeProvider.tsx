"use client";

import { ReactNode, useLayoutEffect } from "react";

export default function LightThemeProvider({ children }: {
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    // TODO
    console.log("Switched To Light", window);
    document.body.classList.add("light");
    return () => {
      document.body.classList.remove("light");
    };
  }, []);
  return <>{children}</>;
}