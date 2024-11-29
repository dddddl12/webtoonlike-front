"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function TranslationDropdown({ children, defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(value: any) {
    router.replace(pathname, { locale: value });
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger className="bg-transparent border-none w-30 dark">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent className="dark">
        <SelectGroup>
          {children}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
