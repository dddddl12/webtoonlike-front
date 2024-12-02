import { Col, Row } from "@/components/ui/common";
import Image from "next/image";
import { getCreatorByUserId } from "@/resources/creators/creator.controller";
import PageLayout from "@/components/ui/PageLayout";
import CreatorWebtoonList from "@/app/[locale]/creators/[creatorUid]/CreatorWebtoonList";
import { buildImgUrl } from "@/utils/media";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";
import { listWebtoonsByUserId } from "@/resources/webtoons/controllers/webtoonPreview.controller";
import { getLikeCountByUserId } from "@/resources/webtoonLikes/webtoonLike.controller";
import LikeBadge from "@/components/ui/LikeBadge";

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ creatorUid: string }>;
}) {
  const creatorUid = await params.then(p => Number(p.creatorUid));
  const [creator, likeCountResponse, initialWebtoonListResponse] = await Promise.all([
    getCreatorByUserId(creatorUid).then(serverResponseHandler),
    getLikeCountByUserId(creatorUid).then(serverResponseHandler),
    listWebtoonsByUserId(creatorUid, {}).then(serverResponseHandler)
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
      {/*todo 그림 사이즈 고정*/}
      <Col className="sm:items-start gap-5">
        <p className="font-bold text-4xl">
          {creator.localized.name}
        </p>
        <LikeBadge likeCount={likeCountResponse.likeCount }/>
      </Col>
    </Row>
    <CreatorWebtoonList
      initialWebtoonListResponse={initialWebtoonListResponse}
      creatorUid={creatorUid}
    />
  </PageLayout>;
}
