import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shadcn/ui/select";
import { useTranslations } from "next-intl";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UserAccountWithCreatorFormT } from "@/resources/users/dtos/user.dto";
import { FileDirectoryT } from "@/resources/files/files.type";
import useAccountFormImage from "@/components/forms/account/components/AccountFormImage";

export default function useCreatorFieldSet(form: UseFormReturn<UserAccountWithCreatorFormT>) {
  // 번역
  const t = useTranslations("setupPageNextForCreators");

  const prevCreator = form.getValues("creator");
  const thumbnail = useAccountFormImage(prevCreator?.thumbPath);

  const beforeSubmission = async () => {
    await thumbnail.image.uploadAndGetRemotePath(FileDirectoryT.CreatorsThumbnails)
      .then(remotePath => form.setValue("creator.thumbPath", remotePath));
  };

  const element = (
    <fieldset>
      <FormField
        control={form.control}
        name="creator.thumbPath"
        render={() => (
          <FormItem>
            <FormLabel>{t("profilePic")}</FormLabel>
            {thumbnail.element(t("uploadProfilePic"))}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="creator.isAgencyAffiliated"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("whetherOrNotAffiliated")}</FormLabel>
            <FormControl>
              <Select
                defaultValue={prevCreator?.isAgencyAffiliated?.toString()}
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
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="creator.isExperienced"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("workExperience")}</FormLabel>
            <FormControl>
              <Select
                defaultValue={prevCreator?.isExperienced?.toString()}
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
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="creator.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("username")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t("insertUsername")}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="creator.name_en"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("usernameInEnglish")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t("insertUsernameInEnglish")}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

    </fieldset>
  );

  return { element, beforeSubmission };
}
