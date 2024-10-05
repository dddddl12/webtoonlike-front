import React from "react";
import { Box } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Badge } from "@/ui/shadcn/Badge";
import type { GenreT } from "@/types";
import { draftMode } from "next/headers";
import { useLocale } from "next-intl";

type GenreItemProps = {
  selected?: boolean
  item: GenreT
  onClick?: () => void
}

export function GenreItem({
  selected,
  item,
  onClick,
}: GenreItemProps): JSX.Element {
  const locale = useLocale();
  return (
    <Badge
      onClick={onClick}
      style={{ backgroundColor: selected ? "white" : "black", color: selected ? "black" : "white" }}
      className={ "my-1 cursor-pointer rounded-full bg-transparent border hover:text-black text-white border-white"}
    >
      {locale === "ko" ? item.label : item.label_en ?? item.label}
    </Badge>
  );
}