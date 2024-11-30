import { Col, Row } from "@/components/ui/common";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { OfferBuyerT, OfferCreatorT } from "@/resources/offers/dtos/offerUser.dto";
import { UserTypeT } from "@/resources/users/dtos/user.dto";

export default function Profile({ creatorOrBuyer, className }: {
  creatorOrBuyer: OfferCreatorT | OfferBuyerT;
  className?: string;
}) {
  const { user } = creatorOrBuyer;
  return <Col className={className}>
    <Row className="gap-10">
      <Col>
        <Image
          src={buildImgUrl(user.thumbPath, {
            size: "sm",
            fallback: "user"
          })}
          alt="profile_image"
          style={{ objectFit: "cover" }}
          className="rounded-full"
          width={90}
          height={90}
        />
      </Col>
      <Col className="flex-1">
        <Row className="text-2xl font-bold">
          {user.userType === UserTypeT.Creator
            ? `${user.name} (판매자)`
            : `${user.name} (구매자)`}
        </Row>
        <Row className="text-[18px] my-7 font-semibold">
          {getTitle(creatorOrBuyer)}
        </Row>
        {!!user.contactInfo && <>
          <Row className="text-[18px] font-semibold">
            연락처: {user.contactInfo.phone}
          </Row>
          <Row className="text-[18px] font-semibold">
            이메일: {user.contactInfo.email}
          </Row>
        </>}
      </Col>
    </Row>
  </Col>;
}

const getTitle = (creatorOrBuyer: OfferCreatorT | OfferBuyerT) => {
  switch (creatorOrBuyer.user.userType) {
    case UserTypeT.Creator:
      const creator = creatorOrBuyer as OfferCreatorT;
      const affiliatedDisplay = creator.isAgencyAffiliated
        ? "에이전시 소속" : "개인";
      return [affiliatedDisplay, creator.localized.name].join(" / ");
    case UserTypeT.Buyer:
      const buyer = creatorOrBuyer as OfferBuyerT;
      return [buyer.name, buyer.department, buyer.position]
        .filter(el => Boolean(el)).join(" / ");
  }
};