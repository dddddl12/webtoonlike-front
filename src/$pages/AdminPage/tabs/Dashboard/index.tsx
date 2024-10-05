import { useListData } from "@/hooks/ListData";
import * as BidRoundsApi from "@/apis/bid_rounds";
import * as AdminApi from "@/apis/admins";
import { ListAdminOptionT, ListBidRoundOptionT } from "@/types";
import { use, useEffect, useState } from "react";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import Link from "next/link";
import { useMe } from "@/states/UserState";
import { getUsersStats } from "@/apis/users";

const MOCK_DATA_LIST = [
  { id: 1, title: "전체 유저", content: 0 },
  { id: 2, title: "신규 유저", content: 0 },
  { id: 3, title: "신규 작품", content: 0 },
  { id: 4, title: "신규 오퍼", content: 0 },
];

export function Dashboard() {
  // const me = useMe();
  // const bidRoundListOpt: ListBidRoundOptionT = {
  //   $webtoon: true,
  //   $user: true,
  // };

  // const { data: bidRounds$, actions: bidRoundsAct } = useListData({
  //   listFn: BidRoundsApi.list
  // });

  // const adminListOpt: ListAdminOptionT = {
  //   meId: me?.id,
  //   $user: true,
  // };

  // const { data: adminList$, actions: adminListAct } = useListData({
  //   listFn: AdminApi.list
  // });

  // useEffect(() => {
  //   bidRoundsAct.load(bidRoundListOpt);
  //   adminListAct.load(adminListOpt);
  // }, []);

  // const { status: bidRoundsStatus, data: bidRounds } = bidRounds$;
  // const { status: adminListStatus, data: adminList } = adminList$;

  // const isLoading = (status: string) => status === "idle" || status === "loading";
  // const isError = (status: string) => status === "error";

  // if (isLoading(bidRoundsStatus) || isLoading(adminListStatus)) {
  //   return <div>loading...</div>;
  // }
  // if (isError(bidRoundsStatus) || isError(adminListStatus)) {
  //   return <div>error loading webtoon</div>;
  // }

  const [userStats, setUserStats] = useState([
    { id: 1, title: "전체 유저", content: 0 },
    { id: 2, title: "신규 유저", content: 0 },
    { id: 3, title: "신규 작품", content: 0 },
    { id: 4, title: "신규 오퍼", content: 0 }
  ]);

  const getUserStats = async () => {
    try {
      const rsp = await getUsersStats();
      setUserStats([
        { id: 1, title: "전체 유저", content: rsp.data.totalUsers },
        { id: 2, title: "신규 유저", content: rsp.data.newUsers },
        { id: 3, title: "신규 작품", content: rsp.data.newWebtoons },
        { id: 4, title: "신규 오퍼", content: rsp.data.newBidRequests },
      ]);
    } catch (e) {
    }
  };

  useEffect(() => {
    getUserStats();
  }, []);

  return (
    <Container className="p-0">
      <Heading className="font-bold text-[18pt]">대시보드</Heading>
      <Gap y={7} />
      <Row className="w-full justify-between">
        {userStats.map((item) => (
          <Col
            key={item.id}
            className="w-[23%] p-5 rounded-md border border-gray"
          >
            <Text>{item.title}</Text>
            <Text className="text-[40pt]">{item.content}</Text>
          </Col>
        ))}
      </Row>
      <Gap y={20} />
      {/* <Heading className="font-bold text-[18pt]">최근 활동</Heading>
      <Gap y={7} />
      <Row className="w-full justify-between border border-gray min-h-[50px] rounded-md">
        <Text className="m-auto">최근 활동이 없습니다.</Text>
      </Row> */}
      <Gap y={97} />
    </Container>
  );
}