import { ReactNode } from "react";
import LightThemeProvider from "@/providers/LightThemeProvider";

export default async function Policies({ children }: {
  children: ReactNode;
}) {
  return (
    <LightThemeProvider>
      {children}
    </LightThemeProvider>
  );
}
