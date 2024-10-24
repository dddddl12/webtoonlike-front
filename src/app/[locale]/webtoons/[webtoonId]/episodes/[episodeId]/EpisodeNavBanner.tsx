"use client";

import { useRouter } from "@/i18n/routing";
import { clsx } from "clsx";
import { ReactNode } from "react";

export default function NavBanner({ webtoonId, episodeId, children }: {
  webtoonId: number,
  episodeId?: number,
  children: ReactNode,
}) {
  const isDisabled = !episodeId;
  const router = useRouter();
  return <button
    disabled={isDisabled}
    className={clsx(
      "sticky top-[50%] z-10 p-2 rounded-full flex gap-2 items-center text-base h-12 px-4", {
        "bg-mint": !isDisabled,
        "bg-gray-shade": isDisabled
      })}
    onClick={e => {
      router.push(`/webtoons/${webtoonId}/episodes/${episodeId}`);
    }}
  >
    {children}
  </button>;
}