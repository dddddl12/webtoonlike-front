import { Heading } from "@/ui/texts";
import { ArtistCarouselBox } from "./ArtistCarouselBox";
import { Col, Gap, Row } from "@/ui/layouts";
import { useTranslations } from "next-intl";

export default function ArtistCarouselSection() {
  const t = useTranslations("homeMain");

  return (
    <section className="w-full flex justify-center items-center">
      <Col className="w-full">
        <Row className="items-center justify-center">
          <Heading className="text-white text-[26pt] font-bold w-[1200px]">
            {t("recommendedCreators")}
          </Heading>
        </Row>
        <Gap y="36px" />
        <ArtistCarouselBox />
      </Col>
    </section>
  );
}
