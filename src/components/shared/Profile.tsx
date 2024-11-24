import { Col, Row } from "@/components/ui/common";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";

export default function Profile({ name, thumbPath, phone, email, title, className }: {
  name: string;
  thumbPath?: string;
  phone?: string;
  email?: string;
  title: string;
  className?: string;
}) {
  return <Col className={className}>
    <Row className="gap-10">
      <Col>
        <Image
          src={buildImgUrl(thumbPath, {
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
        <Row className="text-2xl font-bold">{name}</Row>
        <Row className="text-[18px] my-7 font-semibold">{title}</Row>
        {!!phone && <Row className="text-[18px] font-semibold">
          연락처: {phone}
        </Row>}
        {!!email && <Row className="text-[18px] font-semibold">
          이메일: {email}
        </Row>}
      </Col>
    </Row>

  </Col>;
}