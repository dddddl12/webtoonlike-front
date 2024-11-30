"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Checkbox, CheckboxGroup } from "@/shadcn/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { IconUpload } from "@/components/svgs/IconUpload";
import { useTranslations } from "next-intl";
import {
  AgeLimit,
  TargetAge,
  TargetGender,
  WebtoonFormSchema,
  WebtoonFormT
} from "@/resources/webtoons/dtos/webtoon.dto";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/shadcn/ui/form";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { ImageObject } from "@/utils/media";
import { FileDirectoryT } from "@/resources/files/files.type";
import { createOrUpdateWebtoon } from "@/resources/webtoons/controllers/webtoon.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenreT } from "@/resources/genres/genre.dto";
import { WebtoonDetailsT } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import { clsx } from "clsx";
import useSafeActionForm from "@/hooks/safeActionForm";
import { FormHeader } from "@/components/ui/form/FormHeader";
import SubmitButton from "@/components/ui/form/SubmitButton";

export function WebtoonForm({ selectableGenres, prev }: {
  selectableGenres: GenreT[];
  prev?: WebtoonDetailsT;
}) {
  const t = useTranslations("addSeries");
  const router = useRouter();

  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prev?.thumbPath));

  const { isFormSubmitting, form, onSubmit } = useSafeActionForm(
    createOrUpdateWebtoon.bind(null, prev?.id), {
      resolver: zodResolver(WebtoonFormSchema),
      defaultValues: {
        ...prev,
        genreIds: prev?.genres.map(genre => genre.id) || [],
      },
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          if (prev) {
            router.replace(`/webtoons/${prev.id}`, {
              scroll: true
            });
          } else {
            router.replace("/webtoons", {
              scroll: true
            });
          }
        }
      },
      beforeSubmission: async () => {
        const remotePath = await thumbnail.uploadAndGetRemotePath(FileDirectoryT.WebtoonsThumbnails);
        if (!remotePath) {
          throw new Error("Thumbnail upload failed.");
        }
        form.setValue("thumbPath", remotePath);
      }
    });
  const { formState: { isValid, isDirty } } = form;

  return (
    <Form {...form} schema={WebtoonFormSchema}>
      <form onSubmit={onSubmit} className={clsx("w-[600px] mx-auto space-y-8",
        "[&_fieldset]:flex [&_fieldset]:flex-col [&_fieldset]:gap-3",
        {
          "form-overlay": isFormSubmitting
        })}>
        <FormHeader
          title={prev ? t("editSeries") : t("addSeries")}
          goBackHref={prev ? `/webtoons/${prev.id}` : "/webtoons"}
        />
        <TitleFieldSet form={form}/>
        <AuthorFieldSet form={form}/>
        <ThumbnailField form={form} thumbnail={thumbnail} setThumbnail={setThumbnail}/>
        <DescriptionFieldSet form={form}/>
        <ExternalLinkField form={form}/>
        <GenresField form={form} selectableGenres={selectableGenres}/>
        <GenderField form={form}/>
        <TargetAgeField form={form}/>
        <AgeLimitField form={form}/>
        <SubmitButton disabled={!isValid || !isDirty}
          isNew={!prev}/>
      </form>
    </Form>
  );
}

function TitleFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t("seriesTitle")}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterKoreanTitle")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="title_en"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterEnglishTitle")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  </fieldset>;
}

function AuthorFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <FormField
      control={form.control}
      name="authorName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("authorOptional")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterAuthor")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="authorName_en"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              type="text"
              placeholder={t("enterAuthorEn")}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  </fieldset>;
}

function ThumbnailField({ form, thumbnail, setThumbnail }: {
  form: UseFormReturn<WebtoonFormT>;
  thumbnail: ImageObject;
  setThumbnail: Dispatch<SetStateAction<ImageObject>>;
}) {
  const t = useTranslations("addSeries");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return <FormItem>
    <FormLabel>{t("seriesImage")}</FormLabel>
    <FormControl>
      <Input
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        ref={fileInputRef}
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
    <div
      className="flex flex-col justify-center items-center bg-box rounded-sm w-[178px] h-[270px] cursor-pointer relative"
      onClick={() => fileInputRef.current?.click()}
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
          <IconUpload className="fill-muted-foreground"/>
          <p className="mt-5 text-muted-foreground">
            300 X 450
          </p>
        </>
      )}
    </div>
    <FormMessage/>
  </FormItem>;
}

function DescriptionFieldSet({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");

  return <fieldset>
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("seriesIntro")}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={t("enterKoreanIntro")}
              maxLength={1000}
            />
          </FormControl>
          <div className="text-xs text-muted-foreground text-right mt-1">
            ({(field.value?.length || 0).toLocaleString()}/{(1000).toLocaleString()})
          </div>
          <FormMessage/>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="description_en"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              {...field}
              onChange={field.onChange}
              placeholder={t("enterEnglishIntro")}
              maxLength={1000}
            />
          </FormControl>
          <div className="text-xs text-muted-foreground text-right mt-1">
            ({(field.value?.length || 0).toLocaleString()}/{(1000).toLocaleString()})
          </div>
          <FormMessage/>
        </FormItem>
      )}
    />
  </fieldset>;
}

function ExternalLinkField({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  return <FormField
    control={form.control}
    name="externalUrl"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("seriesLink")}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text"
            placeholder={t("pleaseEnterLink")}
          />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function GenresField({ form, selectableGenres }: {
  form: UseFormReturn<WebtoonFormT>;
  selectableGenres: GenreT[];
}) {
  const t = useTranslations("addSeries");

  return <FormField
    control={form.control}
    name="genreIds"
    render={() => (
      <FormItem>
        <FormLabel>{t("selectGenres")}</FormLabel>
        <CheckboxGroup>
          {selectableGenres.map((genre) => (
            <FormField
              key={genre.id}
              control={form.control}
              name="genreIds"
              defaultValue={[]}
              render={({ field }) => {
                return (
                  <FormItem>
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
                      {genre.localized.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </CheckboxGroup>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function GenderField({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  const tGender = useTranslations("targetGender");

  return <FormField
    control={form.control}
    name="targetGender"
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {t("targetGender")}
        </FormLabel>
        <FormControl>
          <RadioGroup
            {...field}
            onValueChange={field.onChange}
          >
            {Object.values(TargetGender).map((item, index) => (
              <FormItem key={index} className="flex items-center gap-1.5">
                <FormControl>
                  <RadioGroupItem value={item} />
                </FormControl>
                <FormLabel>
                  {tGender(item)}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function TargetAgeField({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  const tTargetAge = useTranslations("targetAge");

  return <FormField
    control={form.control}
    name="targetAges"
    render={() => (
      <FormItem>
        <FormLabel>{t("targetAge")}</FormLabel>
        <CheckboxGroup>
          {Object.values(TargetAge).map((item, index) => (
            <FormField
              key={index}
              control={form.control}
              name="targetAges"
              defaultValue={[]}
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
        </CheckboxGroup>
        <FormMessage/>
      </FormItem>
    )}
  />;
}


function AgeLimitField({ form }: {
  form: UseFormReturn<WebtoonFormT>;
}) {
  const t = useTranslations("addSeries");
  const tAgeRestriction = useTranslations("ageRestriction");

  return <FormField
    control={form.control}
    name="ageLimit"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("filmRating")}</FormLabel>
        <FormControl>
          <RadioGroup
            {...field}
            onValueChange={field.onChange}
          >
            {Object.values(AgeLimit).map((item, index) => (
              <FormItem key={index}>
                <FormControl>
                  <RadioGroupItem value={item}/>
                </FormControl>
                <FormLabel>
                  {tAgeRestriction(item)}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
  />;
}
