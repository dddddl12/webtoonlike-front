import { Col } from "@/components/ui/common";
import { Heading2 } from "@/components/ui/common";
import { getTranslations } from "next-intl/server";
import LikedWebtoonListGrid from "@/app/[locale]/account/LikedWebtoonListGrid";
import { responseHandler } from "@/handlers/responseHandler";
import { listLikedWebtoons } from "@/resources/webtoons/controllers/webtoonPreview.controller";

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
