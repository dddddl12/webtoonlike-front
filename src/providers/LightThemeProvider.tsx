"use client";

import { ReactNode, useLayoutEffect } from "react";

export default function LightThemeProvider({ children }: {
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    document.body.classList.add("light");
    return () => {
      document.body.classList.remove("light");
    };
  }, []);
  return children;
}