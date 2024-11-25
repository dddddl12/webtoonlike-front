import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Col, Row } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { Link } from "@/i18n/routing";
import AccountBasicInfoSectionDeleteButton from "@/app/[locale]/account/AccountBasicInfoSectionDeleteButton";
import { getSimpleUserProfile } from "@/resources/users/controllers/user.controller";
import { responseHandler } from "@/handlers/responseHandler";
import { getMyLikeCount } from "@/resources/webtoonLikes/webtoonLike.controller";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import LikeBadge from "@/components/ui/LikeBadge";

export default async function AccountBasicInfoSection() {
  const TeditProfile = await getTranslations("accountPage");
  const { metadata } = await getTokenInfo();
  const [user, likeCountResponse] = await Promise.all([
    getSimpleUserProfile().then(responseHandler),
    metadata.type === UserTypeT.Creator
      ? getMyLikeCount().then(responseHandler)
      : Promise.resolve(undefined)
  ]);
  // getMyLikeCount
  return <Row className="gap-12">
    <Image
      src={user.thumbPath ?? "/img/mock_profile_image.png"}
      alt="profile_image"
      style={{ objectFit: "cover" }}
      className="rounded-full"
      width={160}
      height={160}
    />
    <Col className="items-center justify-center w-full sm:items-start gap-5">
      <p className="font-bold text-[26pt]">
        {user.name}
      </p>
      <Row className="w-full justify-between sm:flex-row">
        <Row className="gap-4">
          {likeCountResponse
            && <LikeBadge likeCount={likeCountResponse.likeCount}/>}
          <Button variant="secondary" asChild>
            <Link href="/account/update">
              {TeditProfile("editProfile")}
            </Link>
          </Button>
        </Row>

        <AccountBasicInfoSectionDeleteButton />
      </Row>
    </Col>
  </Row>;
}


