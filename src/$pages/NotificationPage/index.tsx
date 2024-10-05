"use client";

import React, { useEffect, useState } from "react";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Text } from "@/ui/texts";
import Link from "next/link";
import { useListData } from "@/hooks/ListData";
import { useMe } from "@/states/UserState";
import * as NotificationApi from "@/apis/notifications";
import { ListView } from "@/ui/tools/ListView";
import { NotificationItem } from "@/components/NotificationItem";
import { NotificationT, ListNotificationOptionT } from "@/types";
import Spinner from "@/components/Spinner";

export function NotificationPage() {
  const me = useMe();

  const { data: notifications$, actions: notificationsAct } = useListData({
    listFn: NotificationApi.list,
  });

  const listOpt: ListNotificationOptionT = {
  };

  useEffect(() => {
    if (me) {
      notificationsAct.load(listOpt);
    }
  }, [me?.id]);

  const [notificationStatus, setNotificationStatue] = useState<string>("all");

  function handleNotificationStatus(status: string) {
    setNotificationStatue(status);
  }

  function handleLoaderDetect(): void {
    notificationsAct.refill();
  }

  return (
    <Container>
      <Gap y={20} />

      <Col className="m-auto w-[600px] rounded-md overflow-hidden">
        <Col className="h-[110px] p-[20px] pb-0 border-b-[1px] border-gray sticky top-0 bg-white/95">
          <Row className="justify-between">
            <Text className="text-black text-[16pt] font-bold">알림</Text>
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
        {/* <Col className="p-[20px] pb-0 bg-white text-black max-h-[500px] overflow-y-scroll">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) =>
            <Col key={item} className="rounded-none cursor-pointer px-[20px] py-[12px] hover:bg-gray-light transition-all">
              <Text className="text-black text-[15px]">하울의 움직이는 성 작품이 승인되어 게시되었습니다.</Text>
              <Gap y={1} />
              <Text className="text-gray-shade text-[12px]">2023.11.30 10:45</Text>
            </Col>
          )}
        </Col> */}


        {notifications$.status == "loading" && (
          <Spinner />
        )}


        <ListView
          data={notifications$.data}
          renderItem={(item: NotificationT) => <NotificationItem item={item} />}
          onLoaderDetect={handleLoaderDetect}
        />
      </Col>
      <Gap y={20} />
    </Container>
  );
}
