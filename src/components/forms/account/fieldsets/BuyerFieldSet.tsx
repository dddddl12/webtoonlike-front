import { JSX } from "react";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import MultipleSelector from "@/shadcn/ui/multi-select";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import {
  BuyerCompanyFieldSchema,
  BuyerCompanyTypeSchema,
  BuyerPurposeSchema,
} from "@/resources/buyers/buyer.dto";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { FileDirectoryT } from "@/resources/files/files.type";
import {
  UserAccountWithBuyerFormT,
} from "@/resources/users/dtos/user.dto";
import useAccountFormImage from "@/components/forms/account/components/AccountFormImage";


export default function useBuyerFieldSet(form: UseFormReturn<UserAccountWithBuyerFormT>) {
  // 번역
  const prevBuyer = form.getValues("buyer");

  const thumbnail = useAccountFormImage(prevBuyer?.thumbPath);
  const businessCert = useAccountFormImage(prevBuyer?.businessCertificatePath);
  const businessCard = useAccountFormImage(prevBuyer?.businessCardPath);

  const beforeSubmission = async () => {
    await thumbnail.image.uploadAndGetRemotePath(FileDirectoryT.BuyersThumbnails)
      .then(remotePath => form.setValue("buyer.thumbPath", remotePath));
    await businessCert.image.uploadAndGetRemotePath(FileDirectoryT.BuyersCerts)
      .then(remotePath => form.setValue("buyer.businessCertificatePath", remotePath));
    await businessCard.image.uploadAndGetRemotePath(FileDirectoryT.BuyersCards)
      .then(remotePath => form.setValue("buyer.businessCardPath", remotePath));
  };

  const element = (
    <fieldset>
      <BusinessNumberField form={form}/>
      <BusinessFieldField form={form}/>
      <BusinessTypeField form={form}/>
      <BusinessCertField form={form} element={businessCert.element}/>

      <hr className="my-5"/>

      <BusinessNameField form={form}/>
      <CompanyLogoField form={form} element={thumbnail.element}/>
      <DepartmentField form={form}/>
      <PositionField form={form}/>
      <RoleField form={form}/>
      <BusinessCardField form={form} element={businessCard.element}/>

      <hr className="my-5"/>

      <PurposeField form={form}/>
    </fieldset>
  );

  return { element, beforeSubmission };
}

function BusinessNumberField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.businessNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("businessRegNo")}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type='text'
            inputMode="numeric"
            placeholder={t("businessRegPlaceholder")}
          />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function BusinessFieldField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  const tBusinessFields = useTranslations("businessFields");

  const options = BuyerCompanyFieldSchema.options
    .map(value => ({
      label: tBusinessFields(value, { plural: false }), value
    }));

  return <FormField
    control={form.control}
    name="buyer.businessField"
    render={({ field }) => {
      if (!field.value) {
        form.setValue(field.name, [], {
          shouldValidate: true
        });
      }
      const preSelectOptions = options.filter(option => field.value?.includes(option.value));
      return <FormItem>
        <FormLabel>{t("businessField")}</FormLabel>
        <FormControl>
          <MultipleSelector
            onChange={(options) => {
              form.setValue(field.name,
                options.map(o => BuyerCompanyFieldSchema.parse(o.value)), {
                  shouldValidate: true
                }
              );
            }}
            inputProps={{
              name: field.name
            }}
            value={preSelectOptions}
            defaultOptions={options}
            placeholder={t("businessFieldPlaceholder")}
            hidePlaceholderWhenSelected
          />
        </FormControl>
        <FormMessage/>
      </FormItem>;
    }}
  />;
}

function BusinessTypeField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  const options = BuyerCompanyTypeSchema.options
    .map(value => ({
      label: t(`businessTypeItems.${value}`), value
    }));

  return <FormField
    control={form.control}
    name="buyer.businessType"
    render={({ field }) => {
      if (!field.value) {
        form.setValue(field.name, [], {
          shouldValidate: true
        });
      }
      const preSelectOptions = options.filter(option => field.value?.includes(option.value));
      return <FormItem>
        <FormLabel>{t("businessType")}</FormLabel>
        <FormControl>
          <MultipleSelector
            onChange={(options) => {
              form.setValue("buyer.businessType",
                options.map(o => BuyerCompanyTypeSchema.parse(o.value)), {
                  shouldValidate: true
                }
              );
            }}
            inputProps={{
              name: field.name
            }}
            value={preSelectOptions}
            defaultOptions={options}
            placeholder={t("businessTypePlaceholder")}
            hidePlaceholderWhenSelected
          />
        </FormControl>
        <FormMessage/>
      </FormItem>;
    }}
  />;
}

function BusinessCertField({ form, element }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
  element: (placeholder: string) => JSX.Element;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.businessCertificatePath"
    render={() => (
      <FormItem>
        <FormLabel>{t("companyLogo")}</FormLabel>
        {element(t("uploadBusinessReg"))}
      </FormItem>
    )}
  />;
}

function BusinessNameField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.name"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("companyName")}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text"
            placeholder={t("insertCompanyName")}
          />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function CompanyLogoField({ form, element }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
  element: (placeholder: string) => JSX.Element;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.thumbPath"
    render={() => (
      <FormItem>
        <FormLabel>{t("companyLogo")}</FormLabel>
        {element(t("insertCompanyLogo"))}
      </FormItem>
    )}
  />;
}

function DepartmentField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.department"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("businessUnit")}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text"
            placeholder={t("insertBusinessUnit")}
          />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function PositionField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  return <FormField
    control={form.control}
    name="buyer.position"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("businessPosition")}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text"
            placeholder={t("insertBusinessPosition")}
          />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function RoleField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.role"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("inChargeOf")}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text"
            placeholder={t("insertInChargeOf")}
          />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function BusinessCardField({ form, element }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
  element: (placeholder: string) => JSX.Element;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.businessCardPath"
    render={() => (
      <FormItem>
        <FormLabel>{t("employmentCert")}</FormLabel>
        {element(t("attachEmploymentCert"))}
      </FormItem>
    )}
  />;
}

function PurposeField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.purpose"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("purposeLabel")}</FormLabel>
        <FormControl>
          <Select defaultValue={field?.value ?? ""}
            onValueChange={field.onChange}
            name={field.name}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("purposePlaceholder")}/>
            </SelectTrigger>
            <SelectContent>
              {BuyerPurposeSchema.options.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`purpose.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}