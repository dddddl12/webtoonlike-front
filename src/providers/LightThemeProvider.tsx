"use client";

import { ReactNode, useLayoutEffect } from "react";

export default function LightThemeProvider({ children }: {
  children: ReactNode;
}) {
  // TODO 다크모드로 통일하면 안되는지?
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