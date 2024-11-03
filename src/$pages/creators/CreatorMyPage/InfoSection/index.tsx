"use client";

import { useMe } from "@/states/UserState";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Text } from "@/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useListData } from "@/hooks/listData";
import * as CreatorApi from "@/apis/creators";
import * as UserApi from "@/apis/users";
import { ListCreatorOptionT } from "@/types";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
import { useAlertDialog } from "@/hooks/ConfirmDialog";
import { useRouter } from "next/navigation";
import { ErrorComponent } from "@/components/ErrorComponent";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";

export function InfoSection() {
  const me = useMe();
  const TeditProfile = useTranslations("editProfilePage");
  const { showAlertDialog } = useAlertDialog();
  const router = useRouter();

  const { data: Creators$, actions: CreatorsAct } = useListData({
    listFn: async (listOpt) => {
      return await CreatorApi.list(listOpt);
    },
  });

  const listOpt: ListCreatorOptionT = {
    $numWebtoonLike: true
  };

  useEffect(() => {
    CreatorsAct.load(listOpt);
  }, []);

  const { status, data: creators } = Creators$;

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }

  if (status == "error") {
    return <ErrorComponent />;
  }

  async function handleClickDeleteMe(): Promise<void> {
    const isOk = await showAlertDialog({
      title: TeditProfile("withdrawal"),
      body: TeditProfile("withdrawalDesc"),
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await UserApi.deleteMe();
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Gap y="80px" />
      <Col className="items-center max-w-[1200px] m-auto ">
        <Col className="w-full justify-center items-center sm:flex-row">
          <div className="w-[160px] h-[160px] overflow-hidden relative rounded-full">
            <Image
              src={me?.creator?.thumbPath ? buildImgUrl(null, me.creator.thumbPath, { size: "sm" } ) : "/img/mock_profile_image.png"}
              alt="profile_image"
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={15} />
          <Gap y={5} />
          <Col className="items-center justify-center w-full sm:items-start">
            {me?.creator ? (
              <Text className="text-white font-bold text-[26pt]">
                {me.creator.name}
              </Text>
            ) : (
              <Text className="font-bold text-[26pt]">
                (알 수 없음)
              </Text>
            )}
            <Gap y={5} />
            <Col className="w-full justify-between sm:flex-row">
              <Col className="sm:flex-row">
                <Row className="bg-white/10 px-3 py-2 text-white rounded-sm cursor-default">
                  {creators.filter((item) => item.id === me?.creator?.id)[0]?.numWebtoonLike || 0}
                  <Gap x={1} />
                  <IconHeartFill fill="red" />
                </Row>
                <Gap x={5} />
                <Gap y={2} />
                <Button className="rounded-sm bg-gray-darker text-white hover:bg-gray-darker" onClick={() => {router.push("/creator/my/update");}}>
                  {TeditProfile("editProfile")}
                </Button>
              </Col>

              <Row className="w-full justify-end">
                <Button
                  className="bg-red text-white rounded-sm hover:bg-gray-darker"
                  onClick={handleClickDeleteMe}
                >
                  {TeditProfile("withdrawal")}
                </Button>
              </Row>
              <Gap y={2} />
            </Col>
          </Col>
        </Col>
      </Col>
      <Gap y="80px" />
    </>
  );
}
