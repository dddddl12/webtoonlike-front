import { Dispatch, SetStateAction, useState } from "react";
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
import { Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { ImageObject } from "@/utils/media";
import { FileDirectoryT } from "@/resources/files/files.type";
import { zodResolver } from "@hookform/resolvers/zod";
import AccountFormImageField from "@/components/forms/account/components/AccountFormImageField";
import AccountFormFooter from "@/components/forms/account/components/AccountFormFooter";
import {
  SignUpStage,
  UserAccountFormT,
  UserAccountWithBuyerFormSchema,
  UserAccountWithBuyerFormT
} from "@/resources/users/dtos/userAccount.dto";
import { createUser } from "@/resources/users/controllers/userAccount.controller";
import { clsx } from "clsx";
import useSafeActionForm from "@/hooks/safeActionForm";


export default function BuyerProfileForm({ userAccountForm, setSignUpStage } : {
  userAccountForm: Partial<UserAccountWithBuyerFormT>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  // 번역
  const t = useTranslations("buyerInfoPage");
  const tGeneral = useTranslations("general");

  const prev = userAccountForm.buyer;
  const prevCompany = prev?.company;
  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prevCompany?.thumbPath));
  const [businessCert, setBusinessCert ] = useState(
    new ImageObject(prevCompany?.businessCertPath));
  const [businessCard, setBusinessCard] = useState(
    new ImageObject(prevCompany?.businessCardPath));

  const { isFormSubmitting, form, onSubmit } = useSafeActionForm(
    createUser, {
      resolver: zodResolver(UserAccountWithBuyerFormSchema),
      defaultValues: userAccountForm,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          setSignUpStage(prevState => prevState + 1);
        }
      },
      beforeSubmission: async () => {
        await thumbnail.uploadAndGetRemotePath(FileDirectoryT.BuyersThumbnails)
          .then(remotePath => form.setValue("buyer.company.thumbPath", remotePath));
        await businessCert.uploadAndGetRemotePath(FileDirectoryT.BuyersCerts)
          .then(remotePath => form.setValue("buyer.company.businessCertPath", remotePath));
        await businessCard.uploadAndGetRemotePath(FileDirectoryT.BuyersCards)
          .then(remotePath => form.setValue("buyer.company.businessCardPath", remotePath));
      }
    });
  const { formState: { isValid } } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={clsx("flex flex-col gap-5", {
          "form-overlay": isFormSubmitting
        })}
      >
        <span className="mb-10">{t("headerDesc")}</span>
        <BusinessNumberField form={form}/>
        <FieldTypeField form={form}/>
        <BusinessTypeField form={form}/>
        <AccountFormImageField
          image={businessCert}
          setImage={setBusinessCert}
          placeholder={t("uploadBusinessReg")}
        />

        <hr className="my-5"/>

        <BusinessNameField form={form}/>
        <AccountFormImageField
          image={thumbnail}
          setImage={setThumbnail}
          placeholder={t("insertCompanyLogo")}
        />
        <DepartmentField form={form}/>
        <PositionField form={form}/>
        <PositionDetailField form={form}/>


        <AccountFormImageField
          image={businessCard}
          setImage={setBusinessCard}
          placeholder={t("attachEmploymentCert")}
        />

        <hr className="my-5"/>

        <PurposeField form={form}/>

        <AccountFormFooter
          isValid={isValid}
          setSignUpStage={setSignUpStage}
          goNextLabel={prev ? `${tGeneral("edit")}` : `${tGeneral("submit")}`}
        />
      </form>
    </Form>
  );
}


function BusinessNumberField({ form }: {
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.company.businessNumber"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            type='text'
            inputMode="numeric"
            placeholder={t("businessRegPlaceholder")}
          />
          {/* TODO  필수 표시*/}
        </FormControl>
      </FormItem>
    )}
  />;
}

function FieldTypeField({ form }: {
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  const tBusinessFields = useTranslations("businessFields");

  const fieldName = "buyer.company.fieldType";
  const options = BuyerCompanyFieldSchema.options
    .map(value => ({
      label: tBusinessFields(value, { plural: false }), value
    }));
  const preSelectValue = form.getValues(fieldName) || [];
  const preSelectOptions = options.filter(option => preSelectValue.includes(option.value));

  return <FormItem>
    <FormControl>
      <MultipleSelector
        onChange={(options) => {
          form.setValue(fieldName,
            options.map(o => BuyerCompanyFieldSchema.parse(o.value)), {
              shouldValidate: true
            }
          );
        }}
        inputProps={{
          name: fieldName
        }}
        value={preSelectOptions}
        defaultOptions={options}
        placeholder={t("businessFieldPlaceholder")}
        hidePlaceholderWhenSelected
      />
    </FormControl>
  </FormItem>;
}

function BusinessTypeField({ form }: {
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  const fieldName = "buyer.company.businessType";
  const options = BuyerCompanyTypeSchema.options
    .map(value => ({
      label: t(`businessTypeItems.${value}`), value
    }));
  const preSelectValue = form.getValues(fieldName) || [];
  const preSelectOptions = options.filter(option => preSelectValue.includes(option.value));

  return <FormItem>
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
          name: fieldName
        }}
        value={preSelectOptions}
        defaultOptions={options}
        placeholder={t("businessTypePlaceholder")}
        hidePlaceholderWhenSelected
      />
    </FormControl>
  </FormItem>;
}

function BusinessNameField({ form }: {
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.company.name"
    render={({ field }) => (
      <FormItem>
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

function DepartmentField({ form }: {
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.company.dept"
    render={({ field }) => (
      <FormItem>
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
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  return <FormField
    control={form.control}
    name="buyer.company.position"
    render={({ field }) => (
      <FormItem>
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
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.company.positionDetail"
    render={({ field }) => (
      <FormItem>
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

function PurposeField({ form }: {
  form: UseFormReturn<UserAccountFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="buyer.purpose"
    render={({ field }) => (
      <FormItem>
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