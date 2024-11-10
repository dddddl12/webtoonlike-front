import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Text } from "@/shadcn/ui/texts";
import { Col, Row } from "@/shadcn/ui/layouts";
import { getClerkUserById, getTokenInfo } from "@/resources/tokens/token.service";
import { Button } from "@/shadcn/ui/button";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { Link } from "@/i18n/routing";
import AccountBasicInfoSectionDeleteButton from "@/app/[locale]/account/AccountBasicInfoSectionDeleteButton";

export default async function AccountBasicInfoSection() {
  const TeditProfile = await getTranslations("accountPage");
  const { userId } = await getTokenInfo();
  const clerkUser = await getClerkUserById(userId);
  if (!clerkUser) {
    throw new Error("clerkUser is null");
  }
  return <Row className="gap-12">
    <Image
      src={clerkUser.imageUrl ?? "/img/mock_profile_image.png"}
      alt="profile_image"
      style={{ objectFit: "cover" }}
      className="rounded-full"
      width={160}
      height={160}
    />
    <Col className="items-center justify-center w-full sm:items-start gap-5">
      <Text className="font-bold text-[26pt]">
        {clerkUser.username}
      </Text>
      <Row className="w-full justify-between sm:flex-row">
        <Col className="sm:flex-row">
          {/*TODO 이 페이지가 필요한가*/}
          {/*TODO 좋아요 기준*/}
          {/*<Row className="bg-white/10 px-3 py-2 rounded-sm cursor-default">*/}
          {/*  {creators.filter((item) => item.id === me?.creator?.id)[0]?.numWebtoonLike || 0}*/}
          {/*  <IconHeartFill fill="red" />*/}
          {/*</Row>*/}
          <Button variant="secondary">
            <Link href="/account/update">
              {TeditProfile("editProfile")}
            </Link>
          </Button>
        </Col>

        <Row className="w-full justify-end">
          <AccountBasicInfoSectionDeleteButton />
        </Row>
      </Row>
    </Col>
  </Row>;
}


