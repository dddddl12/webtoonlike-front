
import { Heading } from "@/ui/texts";
import { PopularCarouselBox } from "./PopularCarouselBox";
import { Col, Gap, Row } from "@/ui/layouts";

export function PopularCarouselSection() {
  return (
    <section className="w-full flex justify-center items-center">
      <Col className="w-[100%]">
        <Gap y="36px" />
        <PopularCarouselBox />
      </Col>
    </section>
  );
}
