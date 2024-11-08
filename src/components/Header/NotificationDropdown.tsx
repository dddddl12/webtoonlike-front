"use client";

import React, { useState } from "react";
import { IconBell } from "@/components/svgs/IconBell";
import { NotificationItem } from "@/components/NotificationItem";
import { Col, Gap, Row } from "@/components/ui/layouts";
import { Button } from "@/components/ui/shadcn/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/DropdownMenu";
import { Text } from "@/components/ui/texts";
import { clsx } from "clsx";


const rawData = `하울의 움직이는 성/작품이 승인되어 게시되었습니다./2023.11.30 16:24
천공의 성 라퓨타/작품이 반려되었습니다./2023.11.30 10:45
센과 치히로의 행방불명/작품의 오퍼를 확인해보세요./2023.09.23 07:18
붉은 돼지/작품의 오퍼를 확인해보세요./2023.07.18 05:25
그대들은 어떻게 살 것인가/작품의 오퍼를 확인해보세요./2022.12.09 04:08
마녀배달부 키키/작품이 승인되어 게시되었습니다./2022.09.23 04:27
이웃집 토토로/작품의 오퍼를 확인해보세요./2022.05.25 18:07
빨간머리 앤/작품이 반려되었습니다./2022.04.08 07:18`;

const items: {
  title: string;
  message: string;
  date: string;
  status: "approved" | "rejected" | "offered";
}[] = rawData.split("\n")
  .map(l => {
    const [title, message, date] = l.split("/");
    const status = message.includes("승인")
      ? "approved"
      : (message.includes("반려") ? "rejected" : "offered");
    return { title, message, date, status };
  });

export function NotificationDropdown() {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="bg-transparent text-white hover:bg-transparent">
          <IconBell className="fill-white"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className="bg-white text-black rounded-sm min-w-[320px] max-w-[430px] p-0 h-fit">
        <Col className="w-full h-[110px] p-[20px] pb-0 sticky top-0 bg-white/95">
          <Row className="justify-between">
            <Text className="text-black text-[16pt] font-bold">알림</Text>
            <Text className="text-[10pt] text-mint cursor-pointer">전체보기</Text>
          </Row>
          <Gap y="16px" />
          <Row>
            <Button
              className={"rounded-full h-[30px] hover:bg-gray-dark hover:text-white bg-gray-dark text-white"}
            >전체
            </Button>
            <Gap x={2} />
            <Button
              className={"bg-gray-light rounded-full h-[30px] hover:bg-gray-dark hover:text-white text-black"}
            >읽지 않음
            </Button>
          </Row>
        </Col>

        {items.map((item, index) =>
          <Row key={index} className="rounded-none cursor-pointer px-[20px] py-[12px] hover:bg-gray-light transition-all gap-4 mb-3">
            <Icon status={item.status} key={index} />
            <Col>
              <Text className={clsx("text-[15px]", item.status === "offered" ? "text-gray-shade" : "text-black")}>
                <span className="font-bold">{item.title}</span> <span>{item.message}</span>
              </Text>
              <Gap y={1} />
              <Text className="text-gray-shade text-[12px]">{item.date}</Text>
            </Col>
          </Row>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Icon({ status }: {status: "approved" | "rejected" | "offered"}) {
  switch (status) {
    case "approved":
      return <Approved />;
    case "rejected":
      return <Rejected />;
    case "offered":
      return <Offered />;
  }
}

function Approved() {
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="34" height="34" rx="17" stroke="#0AADA2" stroke-width="2"/>
    <path d="M14.7951 21.875L10.6251 17.705L9.20508 19.115L14.7951 24.705L26.7951 12.705L25.3851 11.295L14.7951 21.875Z"
      fill="#0AADA2"/>
  </svg>;
}

function Rejected() {
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="34" height="34" rx="17" stroke="#E32D19" stroke-width="2"/>
    <path d="M25.5 13V17H12.33L15.91 13.41L14.5 12L8.5 18L14.5 24L15.91 22.59L12.33 19H27.5V13H25.5Z" fill="#E32D19"/>
  </svg>;

}

function Offered() {
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="34" height="34" rx="17" stroke="#B4B4B4" stroke-width="2"/>
    <path
      d="M10 12H8V26C8 27.1 8.9 28 10 28H24V26H10V12ZM26 8H14C12.9 8 12 8.9 12 10V22C12 23.1 12.9 24 14 24H26C27.1 24 28 23.1 28 22V10C28 8.9 27.1 8 26 8ZM26 22H14V10H26V22ZM16 15H24V17H16V15ZM16 18H20V20H16V18ZM16 12H24V14H16V12Z"
      fill="#B4B4B4"/>
  </svg>;

}