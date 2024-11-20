"use client";

import { Dispatch, FormEvent, SetStateAction, useCallback, useState } from "react";
import { Input, NumericInput } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Col, Row } from "@/shadcn/ui/layouts";
import { ImageObject } from "@/utils/media";
import { useTranslations } from "next-intl";
import {
  WebtoonEpisodeFormSchema,
  WebtoonEpisodeT
} from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { toast, useToast } from "@/shadcn/hooks/use-toast";
import { FileDirectoryT } from "@/resources/files/files.type";
import EpisodeImageItem from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/EpisodeImageItem";
import { IconUpArrow } from "@/components/svgs/IconUpArrow";
import { IconDownArrow } from "@/components/svgs/IconDownArrow";
import { IconUpload } from "@/components/svgs/IconUpload";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { useRouter } from "@/i18n/routing";
import { formResolver } from "@/utils/forms";
import Spinner from "@/components/Spinner";
import { Form, FormControl, FormHeader, FormItem, FormLabel } from "@/shadcn/ui/form";
import EpisodeImagePreview from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/EpisodeImagePreview";
import {
  reorderImages,
  ReorderImagesError
} from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/reorderImages";
import { EpisodeImageSet } from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/types";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { createOrUpdateEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const { form, handleSubmitWithAction }
    = useSafeHookFormAction(
      createOrUpdateEpisode.bind(null, webtoonId, prev?.id),
      zodResolver(WebtoonEpisodeFormSchema),
      {
        actionProps: {
          onSuccess: () => {
            if (prev) {
              toast({
                description: "성공적으로 업데이트되었습니다."
              });
              router.replace(`/webtoons/${prev.id}`);
            } else {
              toast({
                description: "성공적으로 생성되었습니다."
              });
              router.replace("/webtoons");
            }
          }
        },
        formProps: {
          defaultValues: prev,
          mode: "onChange",
        }
      });

  // 제출 이후 동작
  const router = useRouter();
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const imagePaths = [];
    for (const { image } of episodeImageSets) {
      const path = await image.uploadAndGetRemotePath(FileDirectoryT.WebtoonEpisodeImages);
      if (path !== undefined) {
        imagePaths.push(path);
      }
    }
    form.setValue("imagePaths", imagePaths);
    // todo error handling

    await handleSubmitWithAction(e);
  }

  // 스피너
  const { formState: { isValid, isSubmitting, isSubmitSuccessful } } = form;
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner/>;
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-[500px] mx-auto">
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      let hasFileExceedingMaxSize = false;
      const newImageSets = acceptedFiles
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
    }, [setEpisodeImageSets])
  });
  const dropzoneRootProps = getRootProps();

  const t = useTranslations("episodeForm");

  return <FormItem>
    <FormLabel>
      {t("episodeImage")}
    </FormLabel>
    <FormControl>
      <Input
        {...getInputProps()}
        className="hidden"
        accept=".png, .jpg, .jpeg"
      />
    </FormControl>
    <ImageListCanvas
      episodeImageSets={episodeImageSets}
      setEpisodeImageSets={setEpisodeImageSets}
      dropzoneRootProps={dropzoneRootProps}
    />
    <Row className="justify-between mt-4">
      <Button
        variant="gray"
        onClick={(e) => {
          e.preventDefault();
          dropzoneRootProps.onClick?.(e);
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
  </FormItem>;
}

function ImageListCanvas({ episodeImageSets, setEpisodeImageSets, dropzoneRootProps }: {
  episodeImageSets: EpisodeImageSet[];
  setEpisodeImageSets: Dispatch<SetStateAction<EpisodeImageSet[]>>;
  dropzoneRootProps: DropzoneRootProps;
}) {
  const t = useTranslations("episodeForm");
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

  if (episodeImageSets.length === 0) {
    return <div
      {...dropzoneRootProps}
      className="flex flex-col gap-3 justify-center items-center bg-gray-darker text-gray-text rounded-sm cursor-pointer w-full h-[340px]"
    >
      <IconUpload/>
      <p>
        {t("dragDesc")}
      </p>
    </div>;
  }
  return <Row className="min-h-[80px] items-stretch">
    <Col
      {...dropzoneRootProps}
      onClick={undefined} // 아이템이 있는 경우 클락 시에는 파일 선택 브라우저가 뜨면 안됨
      className="bg-gray-darker rounded-l-md flex-1 px-5 py-2">
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
