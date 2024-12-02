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
        <div className="text-2xl font-bold">
          {user.userType === UserTypeT.Creator
            ? `${user.name} (판매자)`
            : `${user.name} (구매자)`}
        </div>
        <div className="mt-5 font-semibold">
          {getTitle(creatorOrBuyer)}
        </div>
        {!!user.contactInfo && <div className="mt-5">
          <div className="font-semibold">
            연락처: {user.contactInfo.phone}
          </div>
          <div className="font-semibold">
            이메일: {user.contactInfo.email}
          </div>
        </div>}
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