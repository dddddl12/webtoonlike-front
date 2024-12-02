"use client";

import { createContext, ReactNode, useContext } from "react";

const AdminPageContext = createContext<boolean>(false);

export default function AdminPageContextProvider({ children }: {
  children: ReactNode;
}) {
  return <AdminPageContext.Provider value={true}>
    {children}
  </AdminPageContext.Provider>;
}

export function useAdminPageContext() {
  return useContext(AdminPageContext);
}