"use client";

import { Col, Gap, Row } from "@/components/ui/layouts";
import { Text } from "@/components/ui/texts";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Fragment, cloneElement } from "react";
import { IconDashboard } from "../svgs/IconDashboard";
import { IconUser } from "../svgs/IconUser";
import { IconAlbum } from "../svgs/IconAlbum";
import { IconLetter } from "../svgs/IconLetter";
import { IconAddUser } from "../svgs/IconAddUser";
import { IconDocs } from "../svgs/IconDocs";

const ADMIN_SHEETS = [
  { element: "대시보드", path: "/admin/dashboard", icon: <IconDashboard /> },
  { element: "유저 관리", path: "/admin/manage-user", icon: <IconUser /> },
  { element: "관리자 목록", path: "/admin/manage-admin", icon: <IconAddUser /> },
  { element: "작품 관리", path: "/admin/manage-manuscript", icon: <IconAlbum /> },
  { element: "투고 관리", path: "/admin/manage-submit", icon: <IconDocs /> },
  { element: "오퍼 관리", path: "/admin/manage-offer", icon: <IconDocs /> },
  { element: "인보이스 관리", path: "/admin/manage-invoice", icon: <IconLetter /> },
  { element: "장르 관리", path: "/admin/manage-genre", icon: <IconAlbum/> }
];

export function AdminSheet() {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Col className="min-w-[240px] p-[20px] min-h-[710px] border-r border-r-gray">
      {ADMIN_SHEETS.map((item) =>
        <Fragment key={item.path}>
          <Row className={`${item.path === pathName ? "bg-mint" : ""} w-full h-[48px] px-5 rounded-full justify-center`}>
            <div
              className="w-full flex flex-row justify-start items-center cursor-pointer"
              onClick={() => {router.push(item.path);}}
            >
              <Row className="w-[25px] justify-center">
                {cloneElement(item.icon, { className: item.path === pathName ? "fill-white" : "fill-black" })}
              </Row>
              <Gap x={3} />
              <Text className={`${item.path === pathName ? "text-white" : "text-text-black"} text-[14pt]`}>
                {item.element}
              </Text>
            </div>
          </Row>
          <Gap y={2} />
        </Fragment>
      )}
    </Col>
  );
}
