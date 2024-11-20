"use client";
import { Col } from "@/shadcn/ui/layouts";
import { IconDashboard } from "@/components/svgs/IconDashboard";
import { IconUser } from "@/components/svgs/IconUser";
import { IconAddUser } from "@/components/svgs/IconAddUser";
import { IconAlbum } from "@/components/svgs/IconAlbum";
import { IconDocs } from "@/components/svgs/IconDocs";
import { IconLetter } from "@/components/svgs/IconLetter";
import { Link } from "@/i18n/routing";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

export default function AdminSidebar() {
  return <Col className="w-full h-fit sticky top-[160px]">
    <MenuItem segment="dashboard">
      <span className="w-7 flex justify-center items-center">
        <IconDashboard/>
      </span>
      <p>대시보드</p>
    </MenuItem>
    <MenuItem segment="users">
      <span className="w-7 flex justify-center items-center">
        <IconUser/>
      </span>
      <p>유저 관리</p>
    </MenuItem>
    <MenuItem segment="admins">
      <span className="w-7 flex justify-center items-center">
        <IconAddUser/>
      </span>
      <p>관리자 목록</p>
    </MenuItem>
    <MenuItem segment="webtoons">
      <span className="w-7 flex justify-center items-center">
        <IconAlbum/>
      </span>
      <p>작품 관리</p>
    </MenuItem>
    <MenuItem segment="bid-rounds">
      <span className="w-7 flex justify-center items-center">
        <IconDashboard/>
      </span>
      <p>투고 관리</p>
    </MenuItem>
    <MenuItem segment="offers">
      <span className="w-7 flex justify-center items-center">
        <IconDocs/>
      </span>
      <p>오퍼 관리</p>
    </MenuItem>
    <MenuItem segment="invoices">
      <span className="w-7 flex justify-center items-center">
        <IconLetter/>
      </span>
      <p>인보이스 관리</p>
    </MenuItem>
    <MenuItem segment="genres">
      <span className="w-7 flex justify-center items-center">
        <IconAlbum/>
      </span>
      <p>장르 관리</p>
    </MenuItem>
  </Col>;
}

function MenuItem({ segment, children }: {
  segment: string;
  children: ReactNode;
}) {
  const currentSegment = useSelectedLayoutSegment();

  return <Link
    key={segment}
    className={clsx("w-full flex items-center px-5 h-[48px] gap-4",
      "[&_svg]:fill-current", {
        "bg-mint text-white": segment === currentSegment,
      })}
    href={`/admin/${segment}`}
  >
    {children}
  </Link>;
}
