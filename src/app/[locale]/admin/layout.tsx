import { Col } from "@/shadcn/ui/layouts";
import { ReactNode } from "react";
import LightThemeProvider from "@/providers/LightThemeProvider";
import { assertAdmin } from "@/resources/tokens/token.service";
import AdminSidebar from "@/app/[locale]/admin/AdminSidebar";

export default async function Admin({ children }: {
  children: ReactNode;
}) {
  await assertAdmin();
  return (
    <LightThemeProvider>
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
    </LightThemeProvider>
  );
}
