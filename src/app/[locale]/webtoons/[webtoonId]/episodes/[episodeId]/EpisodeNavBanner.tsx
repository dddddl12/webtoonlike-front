"use client";

import { Link, useRouter } from "@/i18n/routing";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { Button } from "@/ui/shadcn/Button";

export default function NavBanner({ webtoonId, episodeId, children }: {
  webtoonId: number,
  episodeId?: number,
  children: ReactNode,
}) {
  const isDisabled = !episodeId;
  return <Button
    disabled={isDisabled}
    className={clsx(
      "sticky top-[50%] z-10 p-2 rounded-full flex gap-2 items-center text-base h-12 px-4", {
        "bg-mint": !isDisabled,
        "bg-gray-shade": isDisabled
      })}
  >
    <Link
      className="flex items-center gap-2"
      href={`/webtoons/${webtoonId}/episodes/${episodeId}`}
    >
      {children}
    </Link>
  </Button>;
}