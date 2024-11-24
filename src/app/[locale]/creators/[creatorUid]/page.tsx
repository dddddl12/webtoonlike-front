import { Col, Row } from "@/components/ui/common";
import Image from "next/image";
import { getCreatorByUserId } from "@/resources/creators/creator.controller";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import PageLayout from "@/components/ui/PageLayout";
import CreatorWebtoonList from "@/app/[locale]/creators/[creatorUid]/CreatorWebtoonList";
import { buildImgUrl } from "@/utils/media";
import { responseHandler } from "@/handlers/responseHandler";
import { listWebtoonsByUserId } from "@/resources/webtoons/controllers/webtoonPreview.controller";

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ creatorUid: string }>;
}) {
  const creatorUid = await params.then(p => Number(p.creatorUid));
  const [creator, initialWebtoonListResponse] = await Promise.all([
    getCreatorByUserId(creatorUid).then(responseHandler),
    listWebtoonsByUserId({ userId: creatorUid }).then(responseHandler)
  ]);

  return <PageLayout>
    <Row className="gap-12">
      <Image
        src={buildImgUrl(creator.thumbPath, {
          size: "sm",
          fallback: "user"
        })}
        alt="profile_image"
        style={{ objectFit: "cover" }}
        className="rounded-full"
        width={160}
        height={160}
      />
      <Col className="items-center justify-center w-full sm:items-start gap-5">
        <p className="font-bold text-[26pt]">
          {creator.localized.name}
        </p>
        <Row className="w-full justify-between sm:flex-row">
          {/*TODO 좋아요 기준*/}
          <Row className="bg-white/10 px-3 py-2 rounded-sm cursor-default">
            {0}
            <IconHeartFill fill="red" />
          </Row>
        </Row>
      </Col>
    </Row>
    <CreatorWebtoonList
      initialWebtoonListResponse={initialWebtoonListResponse}
      creatorUid={creatorUid}
    />
  </PageLayout>;
}
