import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import MultipleSelector from "@/shadcn/ui/multi-select";
import { useTranslations } from "next-intl";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  BuyerCompanyFieldSchema,
  BuyerCompanyTypeSchema,
  BuyerFormSchema,
  BuyerFormT, BuyerPurposeSchema,
  BuyerT
} from "@/resources/buyers/buyer.types";
import { Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import Spinner from "@/components/Spinner";
import { ImageObject } from "@/utils/media";
import { FileDirectoryT } from "@/resources/files/files.type";
import { SignUpStage, UserExtendedFormSchema, UserExtendedFormT } from "@/resources/users/user.types";
import { AccountFormFooter, AccountFormImageField } from "@/components/Account/common";
import { formResolver } from "@/utils/forms";
import { createUser } from "@/resources/users/user.service";


export default function BuyerProfileForm({ prev, userExtendedForm, setSignUpStage } : {
  prev?: BuyerT;
  userExtendedForm: Partial<UserExtendedFormT>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  // 번역
  const t = useTranslations("buyerInfoPage");
  const tGeneral = useTranslations("general");

  const prevCompany = prev?.company;
  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prevCompany?.thumbPath));
  const [businessCert, setBusinessCert ] = useState(
    new ImageObject(prevCompany?.businessCertPath));
  const [businessCard, setBusinessCard] = useState(
    new ImageObject(prevCompany?.businessCardPath));

  const form = useForm<BuyerFormT>({
    defaultValues: {
      company: {
        name: prevCompany?.name || "",
        fieldType: prevCompany?.fieldType || [],
        businessType: prevCompany?.businessType || [],
        dept: prevCompany?.dept || "",
        position: prevCompany?.position || "",
        positionDetail: prevCompany?.positionDetail || "",
        businessNumber: prevCompany?.businessNumber || "",
      },
      purpose: prev?.purpose,
    },
    mode: "onChange",
    resolver: (values) => formResolver(BuyerFormSchema, values)
  });


  // 제출 이후 동작
  const { formState: { isValid, isSubmitting } } = form;
  const onSubmit = async (values: BuyerFormT) => {
    values.company.thumbPath = await thumbnail.uploadAndGetRemotePath(FileDirectoryT.BuyersThumbnails);
    values.company.businessCertPath = await businessCert.uploadAndGetRemotePath(FileDirectoryT.BuyersCerts);
    values.company.businessCardPath = await businessCard.uploadAndGetRemotePath(FileDirectoryT.BuyersCards);

    const validatedUserForm = UserExtendedFormSchema.parse({
      ...userExtendedForm,
      buyer: values
    });
    await createUser(validatedUserForm);
    setSignUpStage(prevState => prevState + 1);
  };

  // 스피너
  if (isSubmitting) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <span className="text-black mb-10">{t("headerDesc")}</span>
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
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="company.businessNumber"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            className="border-gray"
            type='text'
            inputMode="numeric"
            placeholder={t("businessRegPlaceholder") + " *"}
          />
          {/* TODO  필수 표시*/}
        </FormControl>
      </FormItem>
    )}
  />;
}

function FieldTypeField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  const tBusinessFields = useTranslations("businessFields");

  return <FormItem>
    <FormControl>
      <MultipleSelector
        onChange={(options) => {
          form.setValue("company.fieldType",
            options.map(o => BuyerCompanyFieldSchema.parse(o.value)), {
              shouldValidate: true
            }
          );
        }}
        inputProps={{
          name: "company.fieldType"
        }}
        defaultOptions={BuyerCompanyFieldSchema.options
          .map(value => ({
            label: tBusinessFields(value, { plural: false }), value
          }))}
        placeholder={t("businessFieldPlaceholder")}
        hidePlaceholderWhenSelected
      />
    </FormControl>
  </FormItem>;
}

function BusinessTypeField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormItem>
    <FormControl>
      <MultipleSelector
        onChange={(options) => {
          form.setValue("company.businessType",
            options.map(o => BuyerCompanyTypeSchema.parse(o.value)), {
              shouldValidate: true
            }
          );
        }}
        inputProps={{
          name: "company.businessType"
        }}
        defaultOptions={BuyerCompanyTypeSchema.options
          .map(value => ({
            label: t(`businessTypeItems.${value}`), value
          }))}
        placeholder={t("businessTypePlaceholder")}
        hidePlaceholderWhenSelected
      />
    </FormControl>
  </FormItem>;
}

function BusinessNameField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="company.name"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            className="border-gray"
            type="text"
            placeholder={t("insertCompanyName") + " *"}
          />
        </FormControl>
      </FormItem>
    )}
  />;
}

function DepartmentField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="company.dept"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            className="border-gray"
            type="text"
            placeholder={t("insertBusinessUnit")}
          />
        </FormControl>
      </FormItem>
    )}
  />;
}

function PositionField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");
  return <FormField
    control={form.control}
    name="company.position"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            className="border-gray"
            type="text"
            placeholder={t("insertBusinessPosition")}
          />
        </FormControl>
      </FormItem>
    )}
  />;
}

function PositionDetailField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="company.positionDetail"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            className="border-gray"
            type="text"
            placeholder={t("insertInChargeOf")}
          />
        </FormControl>
      </FormItem>
    )}
  />;
}

function PurposeField({ form }: {
  form: UseFormReturn<BuyerFormT>;
}) {
  const t = useTranslations("buyerInfoPage");

  return <FormField
    control={form.control}
    name="purpose"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Select defaultValue={field?.value ?? ""}
            onValueChange={field.onChange}
            name={field.name}
          >
            <SelectTrigger className="bg-white border-gray text-[#94A4B8] rounded-sm">
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