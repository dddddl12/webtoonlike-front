"use client";
import { Row } from "@/components/ui/common";
import { IconRightArrow } from "@/components/svgs/IconRightArrow";
import { useTranslations } from "next-intl";
import LinkWithAccessCheck from "@/components/root/HomePage/ui/LinkWithAccessCheck";

export default function SectionHeading({ title, path }: {
  title: string;
  path?: string;
}) {
  const t = useTranslations("homeMain");

  return <Row className="items-center w-full justify-between mb-9">
    <h1 className="text-[32px] font-bold">
      {title}
    </h1>
    {path && <LinkWithAccessCheck
      href={path}
      className="flex items-center text-lg cursor-pointer">
      {t("seeMorePopularSeries")}
      <IconRightArrow className="ml-2"/>
    </LinkWithAccessCheck>}
  </Row>;
}