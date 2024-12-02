"use client";

import { useCallback, useEffect } from "react";
import { Input, NumericInput } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Col, Row } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import {
  WebtoonEpisodeFormSchema,
  WebtoonEpisodeT
} from "@/resources/webtoonEpisodes/webtoonEpisode.dto";
import { toast, useToast } from "@/shadcn/hooks/use-toast";
import { FileDirectoryT } from "@/resources/files/files.type";
import EpisodeImageItem from "@/components/forms/WebtoonEpisodeForm/EpisodeImageItem";
import { IconUpArrow } from "@/components/svgs/IconUpArrow";
import { IconDownArrow } from "@/components/svgs/IconDownArrow";
import { IconUpload } from "@/components/svgs/IconUpload";
import { useRouter } from "@/i18n/routing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import EpisodeImagePreview from "@/components/forms/WebtoonEpisodeForm/EpisodeImagePreview";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { createOrUpdateEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { ImageList, useEpisodeImageList } from "@/components/forms/WebtoonEpisodeForm/hook";
import useSafeActionForm from "@/hooks/safeActionForm";
import { FormHeader } from "@/components/ui/form/FormHeader";
import SubmitButton from "@/components/ui/form/SubmitButton";

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
export default function WebtoonEpisodeForm({
  webtoonId,
  prev
}: {
  webtoonId: number;
  prev?: WebtoonEpisodeT;
}) {
  const imageList = useEpisodeImageList(prev?.imagePaths);
  const { episodeImages } = imageList;

  const t = useTranslations("episodeForm");
  const { toast } = useToast();
  const router = useRouter();

  const { form, onSubmit, isFormSubmitting } = useSafeActionForm(
    createOrUpdateEpisode.bind(null, webtoonId, prev?.id), {
      resolver: zodResolver(WebtoonEpisodeFormSchema),
      defaultValues: prev,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          if (prev) {
            toast({
              description: "성공적으로 업데이트되었습니다."
            });
            router.replace(`/webtoons/${webtoonId}/episodes/${prev.id}`, {
              scroll: true
            });
          } else {
            toast({
              description: "성공적으로 생성되었습니다."
            });
            router.replace(`/webtoons/${webtoonId}`, {
              scroll: true
            });
          }
        }
      },
      beforeSubmission: async () => {
        const imagePaths = [];
        for (const image of episodeImages) {
          const path = await image.uploadAndGetRemotePath(FileDirectoryT.WebtoonEpisodeImages);
          if (path !== undefined) {
            imagePaths.push(path);
          }
        }
        form.setValue("imagePaths", imagePaths);
      }
    });
  const { formState: { isValid, isDirty } } = form;

  useEffect(() => {
    // 제출이 아닌 validation 통과용
    // 제출 시에는 실제 remote 서버에 이미지 업로드 후 해당 url 사용
    form.setValue("imagePaths", episodeImages
      .map(image => image.url), {
      shouldValidate: true
    });
  }, [episodeImages, form]);

  return (
    <Form {...form} schema={WebtoonEpisodeFormSchema}>
      <form onSubmit={onSubmit} className={clsx("w-[600px] mx-auto space-y-8", {
        "form-overlay": isFormSubmitting
      })}>
        <FormHeader
          title={prev ? t("editEpisode") : t("addEpisode")}
          goBackHref={prev
            ? `/webtoons/${webtoonId}/episodes/${prev.id}`
            : `/webtoons/${webtoonId}`}
        />

        <FormField
          control={form.control}
          name="episodeNo"
          render={({ field }) => (<FormItem>
            <FormLabel>
              {t("episodeNumber")}
            </FormLabel>
            <FormControl>
              <NumericInput
                register={form.register}
                name={field.name}
                placeholder={t("episodeNumberPlaceholder")}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>)}/>

        <ImageListField imageList={imageList} className="mt-8" />
        <SubmitButton
          disabled={!isValid || !isDirty}
          isNew={!prev}/>
      </form>
    </Form>
  );
}

function ImageListField({ imageList, className }: {
  imageList: ImageList;
  className?: string;
}) {

  const { add } = imageList;
  const t = useTranslations("episodeForm");
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      let hasFileExceedingMaxSize = false;
      const filesFiltered = acceptedFiles
        .filter(
          (file) => {
            if (file.size > MAX_THUMBNAIL_SIZE){
              hasFileExceedingMaxSize = true;
              return false;
            }
            return true;
          }
        );
      if (hasFileExceedingMaxSize) {
        toast({
          description: t("cannotIncludeLargeFiles"),
        });
      }
      add(filesFiltered);
    }, [add, t])
  });
  const dropzoneRootProps = getRootProps();

  return <FormItem className={className}>
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
      imageList={imageList}
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

      <EpisodeImagePreview images={imageList.episodeImages}>
        <Button variant="mint">
          {t("episodePreview")}
        </Button>
      </EpisodeImagePreview>
    </Row>
    <FormMessage/>
    <ul className="list-disc p-5 text-muted-foreground text-sm">
      <li>{t("noteDesc1")}</li>
      <li>{t("noteDesc2")}</li>
    </ul>
  </FormItem>;
}

function ImageListCanvas({ imageList, dropzoneRootProps }: {
  imageList: ImageList;
  dropzoneRootProps: DropzoneRootProps;
}) {
  const t = useTranslations("episodeForm");
  const { episodeImages, select, remove, reorder } = imageList;

  if (episodeImages.length === 0) {
    return <div
      {...dropzoneRootProps}
      className="flex flex-col gap-3 justify-center items-center bg-box text-muted-foreground rounded-sm cursor-pointer w-full h-[340px]"
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
      onClick={undefined} // 아이템이 있는 경우 클릭 시에는 파일 선택 브라우저가 뜨면 안됨
      className="bg-box rounded-l-md flex-1 px-5 py-2 overflow-hidden">
      {episodeImages.map((image, cInx) => (
        <EpisodeImageItem
          key={cInx}
          image={image}
          select={(value) => select(cInx, value)}
          remove={() => remove((cInx))}
        />
      ))}
    </Col>
    <Col className="w-[50px]">
      <button
        onClick={(e) => {
          e.preventDefault();
          reorder(true);
        }}
        className="flex-1 rounded-tr-md bg-gray-text hover:bg-gray-text/60 flex justify-center items-center cursor-pointer"
      >
        <IconUpArrow className="fill-white" />
      </button>
      <hr className="border-transparent" />
      <button
        onClick={(e) => {
          e.preventDefault();
          reorder(false);
        }}
        className="flex-1 rounded-br-md bg-gray-text hover:bg-gray-text/60 flex justify-center items-center cursor-pointer"
      >
        <IconDownArrow className="fill-white" />
      </button>
    </Col>
  </Row>;
}
