"use client";

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Text } from "@/shadcn/ui/texts";
import { Label } from "@/shadcn/ui/label";
import { Input, NumericInput } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Col, Row } from "@/shadcn/ui/layouts";
import { ImageObject } from "@/utils/media";
import { useTranslations } from "next-intl";
import {
  WebtoonEpisodeFormSchema,
  WebtoonEpisodeFormT,
  WebtoonEpisodeT
} from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { toast, useToast } from "@/shadcn/hooks/use-toast";
import { FileDirectoryT } from "@/resources/files/files.type";
import EpisodeImageItem from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/EpisodeImageItem";
import { IconUpArrow } from "@/components/svgs/IconUpArrow";
import { IconDownArrow } from "@/components/svgs/IconDownArrow";
import { IconUpload } from "@/components/svgs/IconUpload";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { createEpisode, updateEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { formResolver } from "@/utils/forms";
import Spinner from "@/components/Spinner";
import { Form, FormControl, FormHeader, FormItem, FormLabel } from "@/shadcn/ui/form";
import EpisodeImagePreview from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/EpisodeImagePreview";
import {
  reorderImages,
  ReorderImagesError
} from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/reorderImages";
import { EpisodeImageSet } from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/types";

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

export default function WebtoonEpisodeForm({
  webtoonId,
  prev
}: {
  webtoonId: number;
  prev?: WebtoonEpisodeT;
}) {
  const [episodeImageSets, setEpisodeImageSets] = useState<EpisodeImageSet[]>(
    prev?.imagePaths.map((path) => ({
      image: new ImageObject(path),
      selected: false
    })) ?? []);
  const t = useTranslations("episodeForm");
  const { toast } = useToast();

  const form = useForm<WebtoonEpisodeFormT>({
    defaultValues: {
      episodeNo: prev?.episodeNo,
      imagePaths: prev?.imagePaths || [],
    },
    mode: "onChange",
    resolver: (values) => formResolver(WebtoonEpisodeFormSchema, values)
  });

  // 제출 이후 동작
  const { formState: { isValid, isSubmitting, isSubmitSuccessful } } = form;
  const router = useRouter();
  async function onSubmit(values: WebtoonEpisodeFormT) {

    values.imagePaths = await Promise.all(
      episodeImageSets.map(({ image }) => image.uploadAndGetRemotePath(FileDirectoryT.WebtoonEpisodeImages))
    ).then((paths) => paths
      .filter((path) => path !== undefined)
    );
    // todo error handling

    if (prev){
      const episodeId = prev.id;
      await updateEpisode(episodeId, values);
      toast({
        description: "성공적으로 업데이트되었습니다."
      });
      router.replace(`/webtoons/${webtoonId}/episodes/${episodeId}`);
    } else {
      await createEpisode(webtoonId, values);
      toast({
        description: "성공적으로 생성되었습니다."
      });
      router.replace(`/webtoons/${webtoonId}`);
    }
  }

  // 스피너
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner/>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] mx-auto">
        <FormHeader
          title={prev ? t("editEpisode") : t("addEpisode")}
          goBackHref={prev ? `/webtoons/${webtoonId}/episodes/$` : "/webtoons"}
        />

        <FormItem>
          <FormLabel>
            {t("episodeNumber")}
          </FormLabel>
          <FormControl>
            <NumericInput
              register={form.register}
              name="episodeNo"
              placeholder={t("episodeNumberPlaceholder")}
            />
          </FormControl>
        </FormItem>

        <ImageListField episodeImageSets={episodeImageSets} setEpisodeImageSets={setEpisodeImageSets} />
        <Row className="justify-end">
          <Button
            disabled={!isValid}
            className="rounded-full"
            variant="mint"
          >
            {t("register")}
            <IconRightBrackets />
          </Button>
        </Row>
      </form>
    </Form>
  );
}

function ImageListField({ episodeImageSets, setEpisodeImageSets }: {
  episodeImageSets: EpisodeImageSet[];
  setEpisodeImageSets: Dispatch<SetStateAction<EpisodeImageSet[]>>;
}) {
  const t = useTranslations("episodeForm");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleInputImageChange(e: ChangeEvent<HTMLInputElement>) {
    let hasFileExceedingMaxSize = false;
    const newImageSets = Array.from(e.target.files ?? [])
      .filter(
        (file) => {
          if (file.size > MAX_THUMBNAIL_SIZE){
            hasFileExceedingMaxSize = true;
            return false;
          }
          return true;
        }
      )
      .map((file) => ({
        image: new ImageObject(file),
        selected: false
      }));
    if (hasFileExceedingMaxSize) {
      toast({
        description: "5MB가 넘는 파일은 포함할 없습니다.",
      });
    }
    setEpisodeImageSets(prev => [
      ...prev,
      ...newImageSets
    ]);
  }

  return (
    <>
      <FormItem>
        <FormLabel>
          {t("episodeImage")}
        </FormLabel>
        <FormControl>
          <Input
            className="hidden"
            multiple
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleInputImageChange}
            ref={fileInputRef}
          />
        </FormControl>
      </FormItem>
      <ImageListCanvas episodeImageSets={episodeImageSets} setEpisodeImageSets={setEpisodeImageSets} />
      <Row className="justify-between mt-4">
        <Button
          variant="gray"
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}>
          {t("imageUpload")}
        </Button>

        <EpisodeImagePreview imageSets={episodeImageSets}>
          <Button variant="mint" onClick={(e) => e.preventDefault()}>
            {t("episodePreview")}
          </Button>
        </EpisodeImagePreview>
      </Row>
      <ul className="list-disc p-5 text-gray-text">
        <li>{t("noteDesc1")}</li>
        <li>{t("noteDesc2")}</li>
      </ul>
    </>
  );
}

function ImageListCanvas({ episodeImageSets, setEpisodeImageSets }: {
  episodeImageSets: EpisodeImageSet[];
  setEpisodeImageSets: Dispatch<SetStateAction<EpisodeImageSet[]>>;
}) {
  const { toast } = useToast();

  function handleReorderButtonClick(isUp: boolean) {
    try {
      setEpisodeImageSets(prev => reorderImages(prev, isUp));
    } catch (e) {
      if (e instanceof ReorderImagesError) {
        toast({
          description: e.message
        });
      }
    }
  }

  const t = useTranslations("episodeForm");
  if (episodeImageSets.length === 0) {
    return <Label
      htmlFor="episodes"
      className="flex flex-col justify-center items-center bg-gray-darker rounded-sm overflow-hidden cursor-pointer w-full h-[340px]"
    >
      <IconUpload className="fill-gray-text" />
      <Text className="text-[12pt] text-gray-text mt-3">
        {t("dragDesc")}
      </Text>
    </Label>;
  }
  return <Row className="min-h-[80px] items-stretch">
    <Col className="bg-gray-darker rounded-l-md flex-1 px-5 py-2">
      {episodeImageSets.map((imageSet, cInx) => (
        <EpisodeImageItem
          key={cInx}
          imageSet={imageSet}
          removeHandler={() => {
            setEpisodeImageSets((prev) =>
              prev.filter((prevImageSet) => prevImageSet !== imageSet)
            );
          }}
        />
      ))}
    </Col>
    <Col className="w-[50px]">
      <div
        onClick={() => handleReorderButtonClick(true)}
        className="flex-1 rounded-tr-md bg-gray-text flex justify-center items-center"
      >
        <IconUpArrow className="fill-white" />
      </div>
      <hr className="border-black" />
      <div
        onClick={() => handleReorderButtonClick(false)}
        className="flex-1 rounded-br-md bg-gray-text flex justify-center items-center"
      >
        <IconDownArrow className="fill-white" />
      </div>
    </Col>
  </Row>;
}
