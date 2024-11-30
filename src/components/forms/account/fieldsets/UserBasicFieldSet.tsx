import { useTranslations } from "next-intl";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { AccountFormType } from "@/components/forms/account/accountFormTypes";

export default function UserBasicFieldSet({ form }: {
  form: AccountFormType;
}) {
  const t = useTranslations("setupForm");
  return <fieldset>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("name")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              autoComplete="name"
              placeholder={t("insertName")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("phone")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="tel"
              autoComplete="mobile tel"
              placeholder={t("insertPhone")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />

  </fieldset>;
}
