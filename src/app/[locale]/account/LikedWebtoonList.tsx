import { Col } from "@/shadcn/ui/layouts";
import { Heading2 } from "@/shadcn/ui/texts";
import { getTranslations } from "next-intl/server";
import LikedWebtoonListGrid from "@/app/[locale]/account/LikedWebtoonListGrid";
import { listLikedWebtoons } from "@/resources/webtoons/webtoon.controller";
import { responseHandler } from "@/handlers/responseHandler";

export default async function LikedWebtoonList() {
  const t = await getTranslations("accountPage.myLikes");
  const initialMyLikesListResponse = await listLikedWebtoons({})
    .then(responseHandler);
  return (
    <Col>
      <Heading2 className="text-white text-2xl font-bold">
        {t("myLikedWebtoons")}
      </Heading2>
      <LikedWebtoonListGrid initialMyLikesListResponse={initialMyLikesListResponse}/>
    </Col>
  );
}
