"use client";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { IconRightArrow } from "@/components/svgs/IconRightArrow";
import { useTranslations } from "next-intl";
import LinkWithAccessCheck from "@/components/HomePage/LinkWithAccessCheck";

export default function SectionHeading({ title, path }: {
  title: string;
  path?: string;
}) {
  const t = useTranslations("homeMain");

  return <Row className="text-white items-center w-full justify-between mb-9">
    <h1 className="text-[32px] font-bold">
      {title}
    </h1>
    {path && <LinkWithAccessCheck
      href={path}
      className="flex flex-row items-center justify-end text-[14pt] font-normal text-right cursor-pointer">
      {t("seeMorePopularSeries")}
      <Gap x={2}/>
      <IconRightArrow className="fill-white"/>
    </LinkWithAccessCheck>}
  </Row>;
}