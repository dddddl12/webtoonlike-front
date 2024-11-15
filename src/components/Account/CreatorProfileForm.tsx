import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { ImageObject } from "@/utils/media";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shadcn/ui/select";
import { useTranslations } from "next-intl";
import { CreatorFormSchema, CreatorFormT } from "@/resources/creators/creator.types";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import Spinner from "@/components/Spinner";
import { FileDirectoryT } from "@/resources/files/files.type";
import { SignUpStage, UserExtendedFormSchema, UserExtendedFormT } from "@/resources/users/user.types";
import { formResolver } from "@/utils/forms";
import { createUser } from "@/resources/users/user.service";
import { AccountFormFooter, AccountFormImageField } from "@/components/Account/common";

export default function CreatorProfileForm({ userExtendedForm, setSignUpStage }: {
  userExtendedForm: Partial<UserExtendedFormT>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  // 번역
  const t = useTranslations("setupPageNextForCreators");
  const tGeneral = useTranslations("general");

  const prev = (userExtendedForm as any)?.creator;
  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prev?.thumbPath));
  const form = useForm<CreatorFormT>({
    defaultValues: {
      name: prev?.name ?? "",
      name_en: prev?.name_en ?? "",
      isAgencyAffiliated: prev?.isAgencyAffiliated,
      isExperienced: prev?.isExperienced,
      isExposed: prev?.isExposed ?? false,
    },
    mode: "onChange",
    resolver: (values) => formResolver(CreatorFormSchema, values)
  });

  // 제출 이후 동작
  const { formState: { isValid, isSubmitting, isSubmitSuccessful } } = form;
  const onSubmit = async (values: CreatorFormT) => {
    values.thumbPath = await thumbnail.uploadAndGetRemotePath(FileDirectoryT.CreatorsThumbnails);
    const validatedUserForm = UserExtendedFormSchema.parse({
      ...userExtendedForm,
      creator: values
    });
    await createUser(validatedUserForm);
    setSignUpStage(prevState => prevState + 1);
  };

  // 스피너
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner />;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >

        <span className="mb-10">{t("profileDesc")}</span>
        <AccountFormImageField image={thumbnail} setImage={setThumbnail} placeholder={t("uploadProfilePic")}/>

        <FormField
          control={form.control}
          name="isAgencyAffiliated"
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
          name="isExperienced"
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
          name="name"
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
          name="name_en"
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
