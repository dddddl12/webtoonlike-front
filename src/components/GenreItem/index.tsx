import React from "react";
import { Badge } from "@/ui/shadcn/Badge";
import { useLocale } from "next-intl";
import { GenreT } from "@/resources/genres/genre.types";

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