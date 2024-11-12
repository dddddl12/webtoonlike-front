import { Gap, Row } from "@/shadcn/ui/layouts";
import { IconRightArrow } from "@/components/svgs/IconRightArrow";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function SectionHeading({ title, path }: {
  title: string;
  path?: string;
}) {
  const t = await getTranslations("homeMain");

  return <Row className="text-white items-center w-full justify-between mb-9">
    <h1 className="text-[32px] font-bold">
      {title}
    </h1>
    {path && <Link
      href={path}
      className="flex flex-row items-center justify-end text-[14pt] font-normal text-right cursor-pointer">
      {t("seeMorePopularSeries")}
      <Gap x={2}/>
      <IconRightArrow className="fill-white"/>
    </Link>}
  </Row>;
}