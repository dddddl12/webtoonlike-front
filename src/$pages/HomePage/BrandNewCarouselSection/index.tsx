"use client";

import { Heading } from "@/ui/texts";
import { Col, Gap, Row } from "@/ui/layouts";
import { IconRightArrow } from "@/components/svgs/IconRightArrow";
import { BrandNewCarouselBox } from "./BrandNewCarouselBox";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function BrandNewCarouselSection() {
  const router = useRouter();
  const t = useTranslations("homeMain");

  return (
    <section className="w-full flex justify-center items-center">
      <Col className="w-full">
        <Row className="items-center justify-center">
          <Heading className="text-white text-[26pt] font-bold w-[1200px]">
            {t("recommendedNewSeries")}
            <div
              className="flex flex-row items-center justify-end text-[14pt] font-normal text-right cursor-pointer"
              onClick={() => {router.push("/webtoons");}}>
              {t("seeMoreNewSeries")}
              <Gap x={2} />
              <IconRightArrow className="fill-white"/>
            </div>
          </Heading>
        </Row>
        <BrandNewCarouselBox />
      </Col>
    </section>
  );
}
