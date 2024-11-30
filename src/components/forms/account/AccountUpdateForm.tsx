"use client";
import useSafeActionForm from "@/hooks/safeActionForm";
import { createBuyerUser, createCreatorUser } from "@/resources/users/controllers/user.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserAccountFormT, UserAccountWithBuyerFormSchema, UserAccountWithBuyerFormT,
  UserAccountWithCreatorFormSchema, UserAccountWithCreatorFormT
} from "@/resources/users/dtos/user.dto";
import { useRouter } from "@/i18n/routing";
import { useToast } from "@/shadcn/hooks/use-toast";
import useCreatorFieldSet from "@/components/forms/account/fieldsets/CreatorFieldSet";
import { clsx } from "clsx";
import { Form } from "@/shadcn/ui/form";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import UserBasicFieldSet from "@/components/forms/account/fieldsets/UserBasicFieldSet";
import { AccountFormType } from "@/components/forms/account/accountFormTypes";
import UserAddressFieldSet from "@/components/forms/account/fieldsets/UserAddressFieldSet";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import useBuyerFieldSet from "@/components/forms/account/fieldsets/BuyerFieldSet";
import SubmitButton from "@/components/ui/form/SubmitButton";

export default function AccountUpdateForm({ prev }: {
  prev: UserAccountFormT;
}) {
  if (prev.userType === UserTypeT.Creator) {
    return <CreatorForm formData={prev} />;
  } else {
    return <BuyerForm formData={prev} />;
  }
}

function CreatorForm({ formData }: {
  formData: UserAccountWithCreatorFormT;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("updateAccount");

  const { form, onSubmit, isFormSubmitting } = useSafeActionForm(
    createCreatorUser, {
      resolver: zodResolver(UserAccountWithCreatorFormSchema),
      defaultValues: formData,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: t("updateToast")
          });
          router.replace("/account", {
            scroll: true
          });
        }
      },
      beforeSubmission: async () => {
        await creatorFieldSet.beforeSubmission();
      }
    });
  const { formState: { isValid, isDirty } } = form;

  const creatorFieldSet = useCreatorFieldSet(form);
  return <Form {...form} schema={UserAccountWithCreatorFormSchema}>
    <form
      onSubmit={onSubmit}
      className={clsx("flex flex-col gap-8 [&_fieldset]:space-y-5", {
        "form-overlay": isFormSubmitting
      })}
    >
      <FieldSetWrapper title={t("basicInfo")}>
        <UserBasicFieldSet form={form as AccountFormType}/>
      </FieldSetWrapper>
      <hr/>
      <FieldSetWrapper title={t("address")}>
        <UserAddressFieldSet form={form as AccountFormType}/>
      </FieldSetWrapper>
      <hr/>
      <FieldSetWrapper title={t("creator")}>
        {creatorFieldSet.element}
      </FieldSetWrapper>
      <SubmitButton disabled={!isValid || !isDirty}
        isNew={false}/>
    </form>
  </Form>;
}


function BuyerForm({ formData }: {
  formData: UserAccountWithBuyerFormT;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("updateAccount");

  const { form, onSubmit, isFormSubmitting } = useSafeActionForm(
    createBuyerUser, {
      resolver: zodResolver(UserAccountWithBuyerFormSchema),
      defaultValues: formData,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: t("updateToast")
          });
          router.replace("/account", {
            scroll: true
          });
        }
      },
      beforeSubmission: async () => {
        await buyerFieldSet.beforeSubmission();
      }
    });
  const { formState: { isValid, isDirty } } = form;

  const buyerFieldSet = useBuyerFieldSet(form);
  return <Form {...form} schema={UserAccountWithBuyerFormSchema}>
    <form
      onSubmit={onSubmit}
      className={clsx("flex flex-col gap-8 [&_fieldset]:space-y-5", {
        "form-overlay": isFormSubmitting
      })}
    >
      <FieldSetWrapper title={t("basicInfo")}>
        <UserBasicFieldSet form={form as AccountFormType}/>
      </FieldSetWrapper>
      <hr/>
      <FieldSetWrapper title={t("address")}>
        <UserAddressFieldSet form={form as AccountFormType}/>
      </FieldSetWrapper>
      <hr/>
      <FieldSetWrapper title={t("buyer")}>
        {buyerFieldSet.element}
      </FieldSetWrapper>
      <SubmitButton disabled={!isValid || !isDirty}
        isNew={false}/>
    </form>
  </Form>;
}

function FieldSetWrapper({ title, children }: {
  title: string;
  children: ReactNode;
}) {
  return <div className="flex flex-row gap-2">
    <div className="w-40">
      <span className="font-bold text-xl">{title}</span>
    </div>
    <div className="flex-1">{children}</div>
  </div>;
}
