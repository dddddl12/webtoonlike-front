import { Col } from "@/components/ui/common";
import { ReactNode } from "react";
import LightThemeProvider from "@/providers/LightThemeProvider";
import AdminSidebar from "@/app/[locale]/admin/AdminSidebar";
import { getTokenInfo } from "@/resources/tokens/token.service";
import AdminPageContextProvider from "@/providers/AdminPageContextProvider";

export default async function Admin({ children }: {
  children: ReactNode;
}) {
  await getTokenInfo({
    admin: true,
  });
  return (
    <LightThemeProvider>
      <AdminPageContextProvider>
        <div className="flex w-full light bg-background text-primary">
          <div className="mx-auto max-w-[1200px] w-full flex">
            <Col className="w-[240px] border-r border-r-gray relative">
              <AdminSidebar/>
            </Col>
            <Col className="flex-1 bg-gray-light p-10">
              {children}
            </Col>
          </div>
        </div>
      </AdminPageContextProvider>
    </LightThemeProvider>
  );
}
