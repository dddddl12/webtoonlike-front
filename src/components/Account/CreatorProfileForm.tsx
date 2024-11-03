import React, { useState, useEffect } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Label } from "@/ui/shadcn/Label";
import { Input } from "@/ui/shadcn/Input";
import Image from "next/image";
import { ImageData } from "@/utils/media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/Select";
import { useTranslations } from "next-intl";
import { CreatorFormSchema, CreatorFormT, CreatorT } from "@/resources/creators/creator.types";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/ui/shadcn/Form";
import { useSession } from "@clerk/nextjs";
import { NotSignedInError } from "@/errors";
import Spinner from "@/components/Spinner";
import { useRouter } from "@/i18n/routing";
import { createCreator } from "@/resources/creators/creator.service";
import { useAllRequiredFilled } from "@/hooks/allRequiredFilled";
import { BuyerFormSchema } from "@/resources/buyers/buyer.types";
import { useTokenRefresh } from "@/hooks/tokenRefresh";

export default function CreatorProfileForm({
  prevCreator,
  redirectPath,
}: {
  prevCreator?: CreatorT;
  redirectPath?: string;
}) {
  // 번역
  const t = useTranslations("setupPageNextForCreators");
  const tGeneral = useTranslations("general");

  const [thumbnail, setThumbnail] = useState<ImageData | undefined>(
    prevCreator?.thumbPath ? new ImageData(prevCreator?.thumbPath) : undefined);

  const form = useForm<CreatorFormT>({
    defaultValues: {
      name: prevCreator?.name ?? "",
      name_en: prevCreator?.name_en ?? "",
      thumbPath: prevCreator?.thumbPath ?? "",
      isAgencyAffiliated: prevCreator?.isAgencyAffiliated,
      isExperienced: prevCreator?.isExperienced,
      isExposed: prevCreator?.isExposed ?? false,
    }
  });

  // 필수 필드 체크
  const allRequiredFilled = useAllRequiredFilled(form, CreatorFormSchema);

  // 제출 이후 동작
  const router = useRouter();
  const { tokenRefreshed, startRefresh } = useTokenRefresh();
  useEffect(() => {
    if (!tokenRefreshed) return;
    router.replace(redirectPath || "/");
  }, [tokenRefreshed]);

  // 스피너
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  if (submissionInProgress) {
    return <Spinner />;
  }
  return (
    <>
      <span className="text-black mb-10">{t("profileDesc")}</span>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(async (creatorForm) => {
          setSubmissionInProgress(true);
          await createCreator(creatorForm);
          startRefresh();
        })}>

          <Row className="justify-between">
            <Col className="w-full justify-center items-center">
              {thumbnail && <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
                <Image
                  draggable={false}
                  priority
                  src={thumbnail.url}
                  alt={"thumbnail"}
                  className="bg-white "
                  style={{ objectFit: "cover" }}
                  fill
                />
                <Gap y={5}/>
              </div>}
              <Label htmlFor="thumbnail"
                className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
                <Text className="text-[#94A4B8]  text-[10pt]">
                  {thumbnail?.url || t("uploadProfilePic")}
                </Text>
                <Label htmlFor="thumbnail"
                  className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
              </Label>
            </Col>
            <FormField
              control={form.control}
              name="files.thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="hidden h-0 border border-red"
                      type='file'
                      accept='image/jpeg, image/png'
                      onChange={(e) => {
                        const newFile = e.target.files?.[0];
                        if (newFile) {
                          setThumbnail(new ImageData(newFile));
                        }
                        field.onChange(e);
                      }}
                      value={undefined}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Row>

          <Gap y={5} />

          <FormField
            control={form.control}
            name="isAgencyAffiliated"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    defaultValue={prevCreator?.isAgencyAffiliated?.toString()}
                    onValueChange={(value) => field.onChange(JSON.parse(value))}
                  >
                    <SelectTrigger className="bg-white border-gray text-black-texts rounded-sm">
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

          <Gap y={5} />

          <FormField
            control={form.control}
            name="isExperienced"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    defaultValue={prevCreator?.isExperienced?.toString()}
                    onValueChange={(value) => field.onChange(JSON.parse(value))}
                  >
                    <SelectTrigger className="bg-white border-gray text-black-texts rounded-sm">
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

          <Gap y={5} />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type="text"
                    placeholder={t("username")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5} />

          <FormField
            control={form.control}
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type="text"
                    placeholder={t("usernameInEnglish")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={10} />

          <hr className="border-gray" />

          <Gap y={10} />

          <Input
            type="submit"
            className="w-full bg-black-texts text-white hover:text-black"
            disabled={!allRequiredFilled}
            value={prevCreator ? `${tGeneral("edit")}` : `${tGeneral("submit")}`}
          />
        </form>
      </Form>
    </>
  );
}
