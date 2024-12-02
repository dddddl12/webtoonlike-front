import { Col } from "@/components/ui/common";
import { Heading2 } from "@/components/ui/common";
import { getTranslations } from "next-intl/server";
import LikedWebtoonListGrid from "@/app/[locale]/account/LikedWebtoonListGrid";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";
import { listLikedWebtoons } from "@/resources/webtoons/controllers/webtoonPreview.controller";

export default async function LikedWebtoonList() {
  const t = await getTranslations("accountPage.myLikes");
  const initialMyLikesListResponse = await listLikedWebtoons({})
    .then(serverResponseHandler);
  return (
    <Col>
      <Heading2>
        {t("myLikedWebtoons")}
      </Heading2>
      <LikedWebtoonListGrid initialMyLikesListResponse={initialMyLikesListResponse}/>
    </Col>
  );
}
