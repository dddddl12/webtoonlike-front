import { Col } from "@/ui/layouts";
import { Heading2 } from "@/ui/texts";
import { getTranslations } from "next-intl/server";
import LikedWebtoonListGrid from "@/app/[locale]/account/LikedWebtoonListGrid";
import { listLikedWebtoons } from "@/resources/webtoons/webtoon.service";

export default async function LikedWebtoonList() {
  const t = await getTranslations("accountPage.myLikes");
  const initialMyLikesListResponse = await listLikedWebtoons();
  return (
    <Col>
      <Heading2 className="text-white text-2xl font-bold">
        {t("myLikedWebtoons")}
      </Heading2>
      <LikedWebtoonListGrid initialMyLikesListResponse={initialMyLikesListResponse}/>
    </Col>
  );
}
