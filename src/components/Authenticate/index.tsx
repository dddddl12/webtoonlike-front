import React, { ReactNode } from "react";

export async function Authenticate({ children }: {
  children: ReactNode;
}) {
  return <>
    {children}
  </>;
}
