import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { ImageObject } from "@/utils/media";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shadcn/ui/select";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { FileDirectoryT } from "@/resources/files/files.type";
import { zodResolver } from "@hookform/resolvers/zod";
import AccountFormImageField from "@/components/forms/account/components/AccountFormImageField";
import AccountFormFooter from "@/components/forms/account/components/AccountFormFooter";
import {
  SignUpStage,
  UserAccountWithCreatorFormSchema,
  UserAccountWithCreatorFormT
} from "@/resources/users/dtos/userAccount.dto";
import { createUser } from "@/resources/users/controllers/userAccount.controller";
import { clsx } from "clsx";
import useSafeActionForm from "@/hooks/safeActionForm";

export default function CreatorProfileForm({ userAccountForm, setSignUpStage }: {
  userAccountForm: Partial<UserAccountWithCreatorFormT>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  // 번역
  const t = useTranslations("setupPageNextForCreators");
  const tGeneral = useTranslations("general");

  const prev = userAccountForm.creator;
  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prev?.thumbPath));

  const { isFormSubmitting, form, onSubmit } = useSafeActionForm(
    createUser, {
      resolver: zodResolver(UserAccountWithCreatorFormSchema),
      defaultValues: userAccountForm,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          setSignUpStage(prevState => prevState + 1);
        }
      },
      beforeSubmission: async () => {
        await thumbnail.uploadAndGetRemotePath(FileDirectoryT.CreatorsThumbnails)
          .then(remotePath => form.setValue("creator.thumbPath", remotePath));
      }
    });
  const { formState: { isValid } } = form;

  return (
    <Form {...form} schema={UserAccountWithCreatorFormSchema}>
      <form
        onSubmit={onSubmit}
        className={clsx("flex flex-col gap-5", {
          "form-overlay": isFormSubmitting
        })}
      >
        <span className="mb-10">{t("profileDesc")}</span>
        <AccountFormImageField image={thumbnail} setImage={setThumbnail} placeholder={t("uploadProfilePic")}/>

        <FormField
          control={form.control}
          name="creator.isAgencyAffiliated"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  defaultValue={prev?.isAgencyAffiliated?.toString()}
                  onValueChange={(value) => field.onChange(JSON.parse(value))}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("affiliationWithAnotherAgencyQuestion")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("affiliation")}</SelectItem>
                    <SelectItem value="false">{t("noAffiliation")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creator.isExperienced"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  defaultValue={prev?.isExperienced?.toString()}
                  onValueChange={(value) => field.onChange(JSON.parse(value))}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectYourWorkExperience")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">{t("rookie")}</SelectItem>
                    <SelectItem value="true">{t("experienced")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creator.name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("username")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creator.name_en"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("usernameInEnglish")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <AccountFormFooter
          isValid={isValid}
          setSignUpStage={setSignUpStage}
          goNextLabel={prev ? `${tGeneral("edit")}` : `${tGeneral("submit")}`}
        />
      </form>
    </Form>
  );
}
