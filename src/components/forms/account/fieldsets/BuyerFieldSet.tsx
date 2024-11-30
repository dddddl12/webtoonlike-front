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
import { FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { FileDirectoryT } from "@/resources/files/files.type";
import {
  UserAccountWithBuyerFormT,
} from "@/resources/users/dtos/user.dto";
import useAccountFormImage from "@/components/forms/account/components/AccountFormImage";


export default function useBuyerFieldSet(form: UseFormReturn<UserAccountWithBuyerFormT>) {
  // 번역
  const prevBuyer = form.getValues("buyer");
  const prevCompany = prevBuyer?.company;

  const thumbnail = useAccountFormImage(prevCompany?.thumbPath);
  const businessCert = useAccountFormImage(prevCompany?.businessCertPath);
  const businessCard = useAccountFormImage(prevCompany?.businessCardPath);

  const beforeSubmission = async () => {
    await thumbnail.image.uploadAndGetRemotePath(FileDirectoryT.BuyersThumbnails)
      .then(remotePath => form.setValue("buyer.company.thumbPath", remotePath));
    await businessCert.image.uploadAndGetRemotePath(FileDirectoryT.BuyersCerts)
      .then(remotePath => form.setValue("buyer.company.businessCertPath", remotePath));
    await businessCard.image.uploadAndGetRemotePath(FileDirectoryT.BuyersCards)
      .then(remotePath => form.setValue("buyer.company.businessCardPath", remotePath));
  };

  const element = (
    <fieldset>
      <BusinessNumberField form={form}/>
      <FieldTypeField form={form}/>
      <BusinessTypeField form={form}/>
      <BusinessCertField form={form} element={businessCert.element}/>

      <hr className="my-5"/>

      <BusinessNameField form={form}/>
      <CompanyLogoField form={form} element={thumbnail.element}/>
      <DepartmentField form={form}/>
      <PositionField form={form}/>
      <PositionDetailField form={form}/>
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
    name="buyer.company.businessNumber"
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
      </FormItem>
    )}
  />;
}

function FieldTypeField({ form }: {
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
    name="buyer.company.fieldType"
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
    name="buyer.company.businessType"
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
              form.setValue("buyer.company.businessType",
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
    name="buyer.company.businessCertPath"
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
    name="buyer.company.name"
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
    name="buyer.company.thumbPath"
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
    name="buyer.company.dept"
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
    name="buyer.company.position"
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
      </FormItem>
    )}
  />;
}

function PositionDetailField({ form }: {
  form: UseFormReturn<UserAccountWithBuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.company.positionDetail"
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
    name="buyer.company.businessCardPath"
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
      </FormItem>
    )}
  />;
}