"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";
import { IconLeftBrackets } from "@/components/svgs/IconLeftBrackets";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";

export default function NavButton({ webtoonId, episodeId, direction }: {
  webtoonId: number;
  episodeId?: number;
  direction: "previous" | "next";
}) {
  const isDisabled = !episodeId;
  const t = useTranslations("detailedInfoPage");
  return <Button
    asChild
    disabled={isDisabled}
    className="sticky top-[50%] rounded-full"
    variant={isDisabled ? "gray" : "mint"}
  >
    <Link
      className="flex items-center gap-2"
      href={`/webtoons/${webtoonId}/episodes/${episodeId}`}
    >
      {direction === "previous" && (
        <>
          <IconLeftBrackets />
          {t("viewPreviousEpisode")}
        </>
      )}
      {direction === "next" && (
        <>
          {t("viewNextEpisode")}
          <IconRightBrackets />
        </>
      )}
    </Link>
  </Button>;
}
