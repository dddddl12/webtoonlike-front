import Image from "next/image";
import { Col } from "@/ui/layouts";
import BANNER_IMG from "../../../../public/img/banner/kenaz_banner1.png";
import { MainSearch } from "./MainSearch";

export function BannerSection() {
  return (
    <Col className="relative">
      <Image
        src={BANNER_IMG}
        alt="BANNER_IMG"
        priority
      />

      <MainSearch />
    </Col>
  );
}
