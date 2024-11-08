"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/shadcn/Select";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export function TranslationDropdown({ children, defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(value: any) {
    router.replace(pathname, { locale: value });
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger className="bg-transparent text-white border-none w-30">
        <SelectValue></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {children}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
