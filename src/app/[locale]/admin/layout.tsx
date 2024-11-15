import { Col, Row } from "@/shadcn/ui/layouts";
import { IconDashboard } from "@/components/svgs/IconDashboard";
import { IconUser } from "@/components/svgs/IconUser";
import { IconAddUser } from "@/components/svgs/IconAddUser";
import { IconAlbum } from "@/components/svgs/IconAlbum";
import { IconDocs } from "@/components/svgs/IconDocs";
import { IconLetter } from "@/components/svgs/IconLetter";
import { Link } from "@/i18n/routing";
import { clsx } from "clsx";
import { ReactNode } from "react";
import LightThemeProvider from "@/providers/LightThemeProvider";
import { assertAdmin } from "@/resources/tokens/token.service";

export default async function Admin({ children }: {
  children: ReactNode;
}) {
  await assertAdmin();
  return (
    <LightThemeProvider>
      <div className="flex w-full light bg-background text-primary">
        <div className="mx-auto max-w-[1200px] w-full flex">
          <Col className="w-[240px] border-r border-r-gray relative">
            <Sidebar/>
          </Col>
          <Col className="flex-1 bg-gray-light p-10">
            {children}
          </Col>
        </div>
      </div>
    </LightThemeProvider>
  );
}

function Sidebar() {
  return <Col className="w-full h-fit sticky top-[160px]">
    <MenuItem pathname="/admin/dashboard">
      <span className="w-7 flex justify-center items-center">
        <IconDashboard/>
      </span>
      <p>대시보드</p>
    </MenuItem>
    <MenuItem pathname="/admin/users">
      <span className="w-7 flex justify-center items-center">
        <IconUser/>
      </span>
      <p>유저 관리</p>
    </MenuItem>
    <MenuItem pathname="/admin/admins">
      <span className="w-7 flex justify-center items-center">
        <IconAddUser/>
      </span>
      <p>관리자 목록</p>
    </MenuItem>
    <MenuItem pathname="/admin/webtoons">
      <span className="w-7 flex justify-center items-center">
        <IconAlbum/>
      </span>
      <p>작품 관리</p>
    </MenuItem>
    <MenuItem pathname="/admin/bid-rounds">
      <span className="w-7 flex justify-center items-center">
        <IconDashboard/>
      </span>
      <p>투고 관리</p>
    </MenuItem>
    <MenuItem pathname="/admin/offers">
      <span className="w-7 flex justify-center items-center">
        <IconDocs/>
      </span>
      <p>오퍼 관리</p>
    </MenuItem>
    <MenuItem pathname="/admin/invoices">
      <span className="w-7 flex justify-center items-center">
        <IconLetter/>
      </span>
      <p>인보이스 관리</p>
    </MenuItem>
    <MenuItem pathname="/admin/genres">
      <span className="w-7 flex justify-center items-center">
        <IconAlbum/>
      </span>
      <p>장르 관리</p>
    </MenuItem>
  </Col>;
}

function MenuItem({ pathname, children }: {
  pathname: string;
  children: ReactNode;
}) {
  // TODO
  const currentPathname = "currentPathname";

  return <Row key={pathname}
    className={clsx("w-full h-[48px] px-5 rounded-full justify-center", {
      "bg-mint": pathname === currentPathname,
    })}>
    <Link
      className={clsx("w-full flex items-center p-[20px] gap-4",
        "[&_svg]:fill-current")}
      href={pathname}
    >
      {children}
    </Link>
  </Row>;
}
