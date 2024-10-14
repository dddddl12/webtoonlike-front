"use client";

import { Gap, Row } from "@/ui/layouts";
import { Heading } from "@/ui/texts";
import { IconRightArrow } from "@/components/svgs/IconRightArrow";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function SectionHeading({ title, path }: {
  title: string,
  path: string
}) {
  const router = useRouter();
  const t = useTranslations("homeMain");

  return <Row className="items-center justify-center">
    <Heading className="text-white text-[26pt] font-bold w-[1200px]">
      {title}
      <div
        className="flex flex-row items-center justify-end text-[14pt] font-normal text-right cursor-pointer"
        onClick={() => {router.push(path);}}>
        {t("seeMorePopularSeries")}
        <Gap x={2} />
        <IconRightArrow className="fill-white"/>
      </div>
    </Heading>
  </Row>;
}