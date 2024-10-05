"use client";

import { ThemeProvider } from "next-themes";

export function DarkModeProvider({ children } : {children: React.ReactNode}) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}