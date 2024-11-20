"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Textarea } from "@/shadcn/ui/textarea";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Text } from "@/shadcn/ui/texts";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { IconUpload } from "@/components/svgs/IconUpload";
import { useLocale, useTranslations } from "next-intl";
import {
  AgeLimit,
  TargetAge,
  TargetGender,
  WebtoonFormSchema,
  WebtoonFormT
} from "@/resources/webtoons/webtoon.types";
import { FieldSet, Form, FormControl, FormField, FormHeader, FormItem, FormLabel } from "@/shadcn/ui/form";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { displayName } from "@/utils/displayName";
import { useRouter } from "@/i18n/routing";
import { ImageObject } from "@/utils/media";
import { FileDirectoryT } from "@/resources/files/files.type";
import { BasicGenreT } from "@/resources/genres/genre.service";
import { createOrUpdateWebtoon, WebtoonDetailsT } from "@/resources/webtoons/webtoon.service";
import { toast } from "@/shadcn/hooks/use-toast";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";
import { zodResolver } from "@hookform/resolvers/zod";

export function WebtoonForm({ selectableGenres, prev }: {
  selectableGenres: BasicGenreT[];
  prev?: WebtoonDetailsT;
}) {
  const t = useTranslations("addSeries");
  const tGeneral = useTranslations("general");
  const router = useRouter();

  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prev?.thumbPath));
  const { form, handleSubmitWithAction }
    = useSafeHookFormAction(
      createOrUpdateWebtoon.bind(null, prev?.id),
      zodResolver(WebtoonFormSchema),
      {
        actionProps: {
          onSuccess: () => {
            if (prev) {
              router.replace(`/webtoons/${prev.id}`);
            } else {
              router.replace("/webtoons");
            }
          }
        },
        formProps: {
          defaultValues: {
            ...prev,
            genreIds: prev?.genres.map(genre => genre.id) || [],
          },
          mode: "onChange"
        }
      });

  // 제출 이후 동작
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const remotePath = await thumbnail.uploadAndGetRemotePath(FileDirectoryT.WebtoonsThumbnails);
    if (remotePath) {
      form.setValue("thumbPath", remotePath);
      await handleSubmitWithAction(e);
    } else {
      toast({
        description: "썸네일 이미지를 업로드하지 못했습니다.",
      });
    }
  };

  // 스피너
  const { formState: { isValid, isSubmitting, isSubmitSuccessful } } = form;
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner/>;
  }

  return (
    <Form {...form}>
      <form className="w-[600px] mx-auto" onSubmit={onSubmit}>
        <FormHeader
          title={prev ? t("editSeries") : t("addSeries")}
          goBackHref={prev ? `/webtoons/${prev.id}` : "/webtoons"}
        />
        <TitleFieldSet form={form}/>
        <AuthorFieldSet form={form}/>
        <ThumbnailFieldSet form={form} thumbnail={thumbnail} setThumbnail={setThumbnail}/>
        <DescriptionFieldSet form={form}/>
        <ExternalLinkFieldSet form={form}/>
        <GenresFieldSet form={form} selectableGenres={selectableGenres}/>
        <GenderFieldSet form={form}/>
        <TargetAgeFieldSet form={form}/>
        <AgeLimitFieldSet form={form}/>

        <Row className="justify-end mt-14">
          <Button
            disabled={!isValid}
            variant="mint"
          >
            {prev
              ? `${tGeneral("edit")}`
              : `${tGeneral("submit")}`}
            <IconRightBrackets />
          </Button>
        </Row>
      </form>
    </Form>
  );
}

function TitleFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <FieldSet>
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
  </FieldSet>;
}

function AuthorFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <FieldSet>
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
  </FieldSet>;
}

function ThumbnailFieldSet({ form, thumbnail, setThumbnail }: {
  form: UseFormReturn<WebtoonFormT>;
  thumbnail: ImageObject;
  setThumbnail: Dispatch<SetStateAction<ImageObject>>;
}) {
  const t = useTranslations("addSeries");

  return <FieldSet>
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
            form.setValue("thumbPath", "filedAdded", {
              shouldValidate: true
            });
            // 이 값은 실제 업로드 후 remote url로 대체되지만, {thumbPath: string} 조건의 validator를 통과하기 위함
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
  </FieldSet>;
}

function DescriptionFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <FieldSet>
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
  </FieldSet>;
}

function ExternalLinkFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <FieldSet>
    <legend>{t("seriesLink")}</legend>
    {/*todo url 체커*/}
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
  </FieldSet>;
}

function GenresFieldSet({ form, selectableGenres }: {
  form: UseFormReturn<WebtoonFormT>;
  selectableGenres: BasicGenreT[];
}) {
  const locale = useLocale();
  const t = useTranslations("addSeries");

  return <FieldSet>
    <legend>{t("selectGenres")}</legend>
    <FormField
      control={form.control}
      name="genreIds"
      render={() => (
        <FormItem className="flex flex-wrap gap-3 mt-3">
          {selectableGenres.map((genre) => (
            <FormField
              key={genre.id}
              control={form.control}
              name="genreIds"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center gap-1.5">
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
  </FieldSet>;
}

function GenderFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  const tGender = useTranslations("targetGender");

  return <FieldSet>
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
                <FormItem key={index} className="flex items-center gap-1.5">
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
  </FieldSet>;
}

function TargetAgeFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  const tTargetAge = useTranslations("targetAge");

  return <FieldSet>
    <legend>{t("targetAge")}</legend>
    <FormField
      control={form.control}
      name="targetAges"
      render={() => (
        <FormItem className="flex flex-wrap gap-3 mt-3">
          {Object.values(TargetAge).map((item, index) => (
            <FormField
              key={index}
              control={form.control}
              name="targetAges"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center gap-1.5">
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
  </FieldSet>;
}


function AgeLimitFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  const tAgeRestriction = useTranslations("ageRestriction");

  return <FieldSet>
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
                <FormItem key={index} className="flex items-center gap-1.5">
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
  </FieldSet>;
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
