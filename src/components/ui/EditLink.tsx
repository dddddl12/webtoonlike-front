"use client";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ComponentProps, FC } from "react";
import { clsx } from "clsx";

interface LinkProps extends Omit<ComponentProps<typeof Link>, "children"> {
  isVisible: boolean;
  isNew?: boolean;
}

const EditLink: FC<LinkProps> = ({ isVisible, isNew = false, className, ...props }) => {
  const tGeneral = useTranslations("general");
  if (!isVisible) {
    return null;
  }
  return (
    <Link {...props}
      className={clsx("flex items-center gap-1 clickable", className)}>
      <Pencil1Icon width={18} height={18} />
      <span>{isNew ? tGeneral("add") : tGeneral("edit")}</span>
    </Link>
  );
};

export default EditLink;