"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/shadcn/Input";
import { Button } from "@/components/ui/shadcn/Button";
import { Textarea } from "@/components/ui/shadcn/Textarea";
import { Gap, Row } from "@/components/ui/layouts";
import { Checkbox } from "@/components/ui/shadcn/CheckBox";
import { Text } from "@/components/ui/texts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/RadioGroup";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { IconUpload } from "@/components/svgs/IconUpload";
import { useLocale, useTranslations } from "next-intl";
import {
  AgeLimit,
  TargetAge,
  TargetGender, WebtoonExtendedT,
  WebtoonFormSchema,
  WebtoonFormT
} from "@/resources/webtoons/webtoon.types";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/shadcn/Form";
import { useForm, UseFormReturn } from "react-hook-form";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { FormHeader, TemplatedForm } from "@/components/TemplatedForm";
import { GenreT } from "@/resources/genres/genre.types";
import { displayName } from "@/utils/displayName";
import { createWebtoon, updateWebtoon } from "@/resources/webtoons/webtoon.service";
import { useRouter } from "@/i18n/routing";
import { ImageObject } from "@/utils/media";
import { FileDirectoryT } from "@/resources/files/files.type";

export function WebtoonForm({ selectableGenres, prev }: {
  selectableGenres: GenreT[];
  prev?: WebtoonExtendedT;
}) {
  const t = useTranslations("addSeries");
  const tGeneral = useTranslations("general");

  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prev?.thumbPath));
  const form = useForm<WebtoonFormT>({
    defaultValues: {
      title: prev?.title || "",
      title_en: prev?.title_en || "",
      authorName: prev?.authorName || "",
      authorName_en: prev?.authorName_en || "",
      description: prev?.description || "",
      description_en: prev?.description_en || "",
      externalUrl: prev?.externalUrl || "",
      // TODO 이걸 따로 두어야 하나
      englishUrl: prev?.englishUrl || "",
      targetAges: prev?.targetAges || [],
      ageLimit: prev?.ageLimit,
      targetGender: prev?.targetGender,
      genreIds: prev?.genres.map(genre => genre.id) || [],
      thumbPath: prev?.thumbPath || "",
    }
  });

  // 필수 필드 체크
  const fieldValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  useEffect(() => {
    const { success } = WebtoonFormSchema.safeParse({
      ...fieldValues,
      thumbPath: thumbnail.url,
    });
    setAllRequiredFilled(success);
  }, [fieldValues, thumbnail]);

  // 제출 이후 동작
  const router = useRouter();
  const onSubmit = async (webtoonForm: WebtoonFormT) => {
    setSubmissionInProgress(true);
    const thumbPath = await thumbnail.uploadAndGetRemotePath(FileDirectoryT.WebtoonsThumbnails);
    if (!thumbPath) {
      setSubmissionInProgress(false);
      return;
    }
    webtoonForm.thumbPath = thumbPath;
    if(prev) {
      await updateWebtoon(prev.id, webtoonForm);
      router.replace(`/webtoons/${prev.id}`);
    } else {
      await createWebtoon(webtoonForm);
      router.replace("/webtoons");
    }
  };

  // 스피너
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  if (submissionInProgress) {
    return <Spinner/>;
  }

  return (
    <TemplatedForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[600px]">
        <FormHeader
          title={prev ? t("editSeries") : t("addSeries")}
          goBackHref={prev ? `/webtoons/${prev.id}` : "/webtoons"}
        />
        <TitleFieldSet form={form}/>
        <AuthorFieldSet form={form}/>
        <ThumbnailFieldSet thumbnail={thumbnail} setThumbnail={setThumbnail}/>
        <DescriptionFieldSet form={form}/>
        <ExternalLinkFieldSet form={form}/>
        <GenresFieldSet form={form} selectableGenres={selectableGenres}/>
        <GenderFieldSet form={form}/>
        <TargetAgeFieldSet form={form}/>
        <AgeLimitFieldSet form={form}/>

        <Row className="justify-end mt-14">
          <Button
            disabled={!allRequiredFilled}
            className="bg-mint text-white hover:bg-mint/70"
          >
            {prev
              ? `${tGeneral("edit")}`
              : `${tGeneral("submit")}`}
            <Gap x={2}/>
            <IconRightBrackets className="fill-white"/>
          </Button>
        </Row>
      </form>
    </TemplatedForm>
  );
}

function TitleFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <legend>{t("seriesTitle")}</legend>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterKoreanTitle")}
            />
          </FormControl>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="title_en"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterEnglishTitle")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </fieldset>;
}

function AuthorFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <legend>{t("authorOptional")}</legend>
    <FormField
      control={form.control}
      name="authorName"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterAuthor")}
            />
          </FormControl>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="authorName_en"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterAuthorEn")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </fieldset>;
}

function ThumbnailFieldSet({ thumbnail, setThumbnail }: {
  thumbnail: ImageObject,
  setThumbnail: Dispatch<SetStateAction<ImageObject>>
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <legend>{t("seriesImage")}</legend>
    <FormItem className="mt-3">
      <FormControl>
        <Input
          type="file"
          accept="image/jpeg, image/png"
          className="hidden"
          onChange={(event) => {
            const imageData = new ImageObject(event.target.files?.[0]);
            setThumbnail(imageData);
          }}
        />
      </FormControl>
      <FormLabel
        className="flex flex-col justify-center items-center bg-gray-darker rounded-sm w-[178px] h-[270px] mt-3 cursor-pointer relative"
      >
        {thumbnail.url ? (
          <Image
            draggable={false}
            priority
            src={thumbnail.url}
            alt={"thumbnail"}
            style={{
              objectFit: "cover",
            }}
            fill
          />
        ) : (
          <>
            <IconUpload className="fill-gray-text"/>
            <Gap y={5}/>
            <Text className="text-gray-text">
              300 X 450
            </Text>
          </>
        )}
      </FormLabel>
    </FormItem>
  </fieldset>;
}

function DescriptionFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <legend>{t("seriesIntro")}</legend>
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <div className="relative">
          <FormItem className="mt-3">
            <FormControl>
              <Textarea
                {...field}
                onChange={field.onChange}
                placeholder={t("enterKoreanIntro")}
                maxLength={1000}
              />
            </FormControl>
          </FormItem>
          <span className="absolute right-2 bottom-1 text-xs text-gray-text ">
            {field.value?.length || 0}/1,000
          </span>
        </div>
      )}
    />

    <FormField
      control={form.control}
      name="description_en"
      render={({ field }) => (
        <div className="relative">
          <FormItem className="mt-3">
            <FormControl>
              <Textarea
                {...field}
                onChange={field.onChange}
                placeholder={t("enterEnglishIntro")}
                maxLength={1000}
              />
            </FormControl>
          </FormItem>
          <span className="absolute right-2 bottom-1 text-xs text-gray-text ">
            {field.value?.length || 0}/1,000
          </span>
        </div>
      )}
    />
  </fieldset>;
}

function ExternalLinkFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <legend>{t("seriesLink")}</legend>
    <FormField
      control={form.control}
      name="externalUrl"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("pleaseEnterLink")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </fieldset>;
}

function GenresFieldSet({ form, selectableGenres }: {
  form: UseFormReturn<WebtoonFormT>
  selectableGenres: GenreT[];
}) {
  const locale = useLocale();
  const t = useTranslations("addSeries");

  return <fieldset>
    <legend>{t("selectGenres")}</legend>
    <FormField
      control={form.control}
      name="genreIds"
      render={() => (
        <FormItem className="flex flex-wrap gap-3 space-y-0 mt-3">
          {selectableGenres.map((genre) => (
            <FormField
              key={genre.id}
              control={form.control}
              name="genreIds"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center space-x-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(genre.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (field.value.length >= 2) {
                              return;
                            }
                            field.onChange([...field.value, genre.id]);
                          } else {
                            field.onChange(
                              field.value?.filter(
                                (value) => value !== genre.id
                              )
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>
                      {displayName(locale, genre.label, genre.label_en)}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </FormItem>
      )}
    />
  </fieldset>;
}

function GenderFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");
  const tGender = useTranslations("targetGender");

  return <fieldset>
    <legend>{t("targetGender")}</legend>
    <FormField
      control={form.control}
      name="targetGender"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <RadioGroup
              {...field}
              className="flex flex-wrap gap-3"
              onValueChange={field.onChange}
            >
              {Object.values(TargetGender).map((item, index) => (
                <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
                  <FormControl>
                    <RadioGroupItem
                      className="border border-white"
                      value={item}
                    />
                  </FormControl>
                  <FormLabel>
                    {tGender(item)}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  </fieldset>;
}

function TargetAgeFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");
  const tTargetAge = useTranslations("targetAge");

  return <fieldset>
    <legend>{t("targetAge")}</legend>
    <FormField
      control={form.control}
      name="targetAges"
      render={() => (
        <FormItem className="flex flex-wrap gap-3 space-y-0 mt-3">
          {Object.values(TargetAge).map((item, index) => (
            <FormField
              key={index}
              control={form.control}
              name="targetAges"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center space-x-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item])
                            : field.onChange(
                              field.value?.filter(
                                (value) => value !== item
                              )
                            );
                        }}
                      />
                    </FormControl>
                    <FormLabel>
                      {tTargetAge(item)}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </FormItem>
      )}
    />
  </fieldset>;
}


function AgeLimitFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>
}) {
  const t = useTranslations("addSeries");
  const tAgeRestriction = useTranslations("ageRestriction");

  return <fieldset>
    <legend>{t("filmRating")}</legend>

    <FormField
      control={form.control}
      name="ageLimit"
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <RadioGroup
              {...field}
              className="flex flex-wrap gap-3"
              onValueChange={field.onChange}
            >
              {Object.values(AgeLimit).map((item, index) => (
                <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
                  <FormControl>
                    <RadioGroupItem
                      className="border border-white"
                      value={item}
                    />
                  </FormControl>
                  <FormLabel>
                    {tAgeRestriction(item)}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  </fieldset>;
}

//TODO
{/* <Label>{t("seriesKeywords")}</Label>
      <Input
        className="text-black"
        id="keyword"
        value={keyword || undefined}
        onChange={handleKeywordChange}
        placeholder={t("pleaseEnterKeywords")}
      /> */}
