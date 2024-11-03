"use client";

import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import Image from "next/image";
import * as CreatorApi from "@/apis/creators";
import { useListData } from "@/hooks/listData";
import { useEffect } from "react";
import { ListCreatorOptionT } from "@/types";
import { buildImgUrl } from "@/utils/media";
import { Button } from "@/ui/shadcn/Button";
import type { CreatorT } from "@/types";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";

export default function OtherCreatorInfoSection({ creator }: { creator: CreatorT }) : JSX.Element {
  const { data: Creators$, actions: CreatorAct } = useListData({
    listFn: CreatorApi.list,
  });

  const listOpt: ListCreatorOptionT = {
    $numWebtoon: true,
    $numWebtoonLike: true,
  };

  const { data: creators } = Creators$;

  useEffect(() => {
    CreatorAct.load(listOpt);
  }, []);

  return (
    <>
      <Gap y="80px" />
      <Col className="items-center m-auto">
        {creators.map((artist) => {
          return (
            <Col
              key={artist.userId}
              className="w-full justify-center items-center sm:flex-row"
            >
              {artist.userId === creator.userId && (
                <>
                  <div className="w-[160px] h-[160px] overflow-hidden relative rounded-full">
                    <Image
                      src={
                        artist.thumbPath
                          ? buildImgUrl(null, artist.thumbPath, { size: "sm" })
                          : "/img/mock_profile_image.png"
                      }
                      alt="profile_image"
                      style={{ objectFit: "cover" }}
                      fill
                    />
                  </div>
                  <Gap x={15} />
                  <Gap y={5} />
                  <Col className="items-center justify-center w-full sm:items-start">
                    <Text className="text-white font-bold text-[26pt]">
                      {artist.name}
                    </Text>
                    <Gap y={5} />
                    <Col className="w-full justify-between sm:flex-row">
                      <Col className="sm:flex-row">
                        <Row className="bg-white/10 px-3 py-2 text-white rounded-sm cursor-default">
                          {artist.numWebtoonLike ?? 0}
                          <Gap x={1} />
                          <IconHeartFill fill="red" />
                        </Row>
                        <Gap x={5} />
                        <Gap y={2} />
                      </Col>
                      <Gap y={2} />
                    </Col>
                  </Col>
                </>
              )}
            </Col>
          );
        })}
      </Col>
      <Gap y="80px" />
    </>
  );
};

