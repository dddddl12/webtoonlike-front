"use client";

import React, { useState } from "react";
import { IconBell } from "@/components/svgs/IconBell";
import { NotificationItem } from "@/components/NotificationItem";
import * as NotificationApi from "@/apis/notifications";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/shadcn/DropdownMenu";
import { Text } from "@/ui/texts";
import { ListView } from "@/ui/tools/ListView";
import { useListData } from "@/hooks/ListData";
import type { ListNotificationOptionT, NotificationT } from "@/types";
import Spinner from "@/components/Spinner";
import { useRouter } from "@/i18n/routing";
import { getUserInfo } from "@/utils/authedUser";

export function NotificationDropdown() {
  const router = useRouter();
  const user = getUserInfo();
  const [notificationStatus, setNotificationStatue] = useState<string>("all");


  const { data: notifications$, actions: notificationsAct } = useListData({
    listFn: NotificationApi.list,
  });

  const listOpt: ListNotificationOptionT = {
    // TODO
    userId: user.id
  };

  notificationsAct.load(listOpt);

  function handleNotificationStatus(status: string) {
    setNotificationStatue(status);
  }

  function handleLoaderDetect(): void {
    notificationsAct.refill();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="bg-transparent text-white hover:bg-transparent">
          <IconBell className="fill-white"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className="bg-white text-black rounded-sm min-w-[320px] max-w-[320px] max-h-[500px] p-0 overflow-y-scroll">
        <Col className="w-full h-[110px] p-[20px] pb-0 border-b-[1px] border-gray sticky top-0 bg-white/95">
          <Row className="justify-between">
            <Text className="text-black text-[16pt] font-bold">알림</Text>
            <Text className="text-[10pt] text-mint cursor-pointer" onClick={() => {router.push("/notifications");}}>전체보기</Text>
          </Row>
          <Gap y="16px" />
          <Row>
            <Button
              className={`bg-gray-light rounded-full h-[30px] hover:bg-gray-dark hover:text-white ${notificationStatus === "all" ? "bg-gray-dark text-white" : ""}`}
              onClick={() => { handleNotificationStatus("all"); }}
            >전체
            </Button>
            <Gap x={2} />
            <Button
              className={`bg-gray-light rounded-full h-[30px] hover:bg-gray-dark hover:text-white ${notificationStatus === "unread" ? "bg-gray-dark text-white" : ""}`}
              onClick={() => { handleNotificationStatus("unread"); }}
            >읽지않음
            </Button>
          </Row>
        </Col>

        {/* {[1, 2, 3, 4, 5].map((item) =>
          <Col key={item} className="rounded-none cursor-pointer px-[20px] py-[12px] hover:bg-gray-light transition-all">
            <Text className="text-black text-[15px]">하울의 움직이는 성 작품이 승인되어 게시되었습니다.</Text>
            <Gap y={1} />
            <Text className="text-gray-shade text-[12px]">2023.11.30 10:45</Text>
          </Col>
        )} */}
        {notifications$.status == "loading" && (
          <Spinner />
        )}

        {notifications$.status == "loaded" && notifications$.data.length == 0 && (
          <Text>알림이 없습니다.</Text>
        )}


        <ListView
          data={notifications$.data}
          renderItem={(item: NotificationT) => <NotificationItem item={item} />}
          onLoaderDetect={handleLoaderDetect}
        />

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
