import { UserFormSchema } from "@/resources/users/dtos/user.dto";
import { useTranslations } from "next-intl";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { AccountFormType } from "@/components/forms/account/accountFormTypes";

export default function UserAddressFieldSet({ form }: {
  form: AccountFormType;
}) {
  const t = useTranslations("setupForm");
  const tCountries = useTranslations("countries");

  return <fieldset>
    <div className="flex flex-row justify-between gap-2">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>{t("country")}</FormLabel>
            <FormControl>
              <Select defaultValue={field?.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("insertCountry")}/>
                </SelectTrigger>
                <SelectContent>
                  {UserFormSchema.shape.country.options
                    .map((value) => (
                      <SelectItem key={value} value={value}>
                        {tCountries(value, { plural: false })}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="postcode"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>{t("postalCode")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                autoComplete="postal-code"
                placeholder={t("insertPostalCode")}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="addressLine1"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("address1")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              autoComplete="address-level1"
              placeholder={t("insertAddress1")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="addressLine2"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("address2")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              autoComplete="address-level2"
              placeholder={t("insertAddress2")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  </fieldset>;
}
