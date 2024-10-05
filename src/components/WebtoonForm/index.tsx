"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/ui/shadcn/Input";
import { Button } from "@/ui/shadcn/Button";
import { Textarea } from "@/ui/shadcn/Textarea";
import { uploadToS3 } from "@/utils/s3";
import { buildImgUrl } from "@/utils/media";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMe } from "@/states/UserState";
import * as WebtoonApi from "@/apis/webtoons";
import { Label } from "@/ui/shadcn/Label";
import { Col, Gap, Row } from "@/ui/layouts";
import { Checkbox } from "@/ui/shadcn/CheckBox";
import { Text } from "@/ui/texts";
import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { GenreSelector } from "@/components/GenreSelector";
import { IconRightBrackets } from "../svgs/IconRightBrackets";
import { IconUpload } from "../svgs/IconUpload";
import * as GenreApi from "@/apis/genre";
import type { WebtoonT, WebtoonFormT, GenreT, ListGenreOptionT } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useListData } from "@/hooks/ListData";
import Spinner from "../Spinner";
import { ErrorComponent } from "../ErrorComponent";

type LabelValueT<ValueT> = { label: string; value: ValueT };

type WebtoonFormProps = {
  webtoon?: WebtoonT;
  onSubmit: (form: WebtoonFormT, xData: {genres?: GenreT[]}) => any;
};

export function WebtoonForm({
  webtoon: preWebtoon,
  onSubmit,
}: WebtoonFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const locale = useLocale();
  const me = useMe();

  const TaddSeries = useTranslations("addSeries");
  const Tgender = useTranslations("targetGender");
  const Tage = useTranslations("targetAge");
  const Tadult = useTranslations("isItAdultContent");

  const TARGET_GENDER = [
    { label: "성별 무관", value: "all" },
    { label: "남자", value: "male" },
    { label: "여자", value: "female" },
  ] as const;

  const TARGET_AGE = [
    { label: "10대", value: "10-20" },
    { label: "20대", value: "20-30" },
    { label: "30대", value: "30-40" },
    { label: "40대", value: "40-50" },
    { label: "50대 이상", value: "50-60" },
  ] as const;

  const AGE_LIMIT = [
    { label: "전체", value: "all" },
    { label: "12+", value: "12+" },
    { label: "15+", value: "15+" },
    { label: "18+", value: "18+" },
  ] as const;

  const [title, setTitle] = useState<string>("");
  const [title_en, setTitle_en] = useState<string>("");
  const [authorDetail, setAuthorDetail] = useState<string>("");
  const [authorDetail_en, setAuthorDetail_en] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [description_en, setDescription_en] = useState<string | null>(null);
  const [descCount, setDescCount] = useState<number>(0);
  const [descCount_en, setDescCount_en] = useState<number>(0);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [genres, setGenres] = useState<GenreT[]>([]);
  const [targetAge, setTargetAge] = useState<WebtoonT["targetAge"]>(null);
  const [ageLimit, setAgeLimit] = useState<WebtoonT["ageLimit"]>(null);
  const [targetGender, setTargetGender] = useState<WebtoonT["targetGender"]>(null);
  const [externalUrl, setExternalUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitDisabled = isSubmitting || title == "" || title_en == "" || description == "";

  const { data: genres$, actions: genresAct } = useListData({
    listFn: GenreApi.list
  });

  const listOpt: ListGenreOptionT = {};


  useEffect(() => {
    genresAct.load(listOpt);
  }, []);

  useEffect(() => {
    if (preWebtoon) {
      setTitle(preWebtoon.title);
      setTitle_en(preWebtoon.title_en ?? "");
      setDescription(preWebtoon.description ?? "");
      setDescription_en(preWebtoon.description_en ?? "");
      setAuthorDetail(preWebtoon.authorDetail ?? "");
      setAuthorDetail_en(preWebtoon.authorDetail_en ?? "");
      setThumbnail(preWebtoon.thumbPath ?? null);
      setTargetAge(preWebtoon.targetAge ?? null);
      setAgeLimit(preWebtoon.ageLimit ?? null);
      setTargetGender(preWebtoon.targetGender ?? null);
      setExternalUrl(preWebtoon.externalUrl ?? "");
      setGenres(preWebtoon.genres ?? []);
    }
  }, [preWebtoon]);

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setTitle(val);
  }

  function handleEnTitleChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setTitle_en(val);
  }

  function handleAuthorDetailChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setAuthorDetail(val);
  }

  function handleAuthorDetailEnChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setAuthorDetail_en(val);
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    const val = e.target.value;
    setDescCount(e.target.value.length);
    setDescription(val);
  }

  function handleEnDescriptionChange(
    e: ChangeEvent<HTMLTextAreaElement>
  ): void {
    const val = e.target.value;
    setDescCount_en(e.target.value.length);
    setDescription_en(val);
  }

  // function handleKeywordChange(e: ChangeEvent<HTMLInputElement>): void {
  //   const val = e.target.value;
  //   setKeyword(val);
  // }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setExternalUrl(val);
  }

  async function handleThumbnailChange(
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length == 0) {
      return;
    }
    const newFile = newFiles[0];
    try {
      const { putUrl, key } = await WebtoonApi.getThumbnailPresignedUrl(
        newFile.type
      );
      await uploadToS3(putUrl, newFile);
      setThumbnail(key);
    } catch (e) {
      enqueueSnackbar("thumbnail change failed", { variant: "error" });
      console.warn(e);
    }
  }

  function handleGenreSelect(genre: GenreT|null): void {
    if (!genre) {
      setGenres([]);
      return;
    }
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g != genre));
    } else {
      if (genres.length >= 2) {
        setGenres([genres[1], genre]);
      } else {
        setGenres([...genres, genre]);
      }
    }
  }

  function handleTargetGenderChange(e: string): void {
    const val = e;
    setTargetGender(val as WebtoonT["targetGender"]);
  }

  function handleTargetAgeChange(
    checked: boolean,
    value: "10-20" | "20-30" | "30-40" | "40-50" | "50-60"
  ): void {
    if (checked) {
      if (targetAge && !targetAge.data.includes(value)) {
        setTargetAge({ data: [...targetAge.data, value] });
      } else {
        setTargetAge({ data: [value] });
      }
    } else {
      if (targetAge) {
        setTargetAge({
          data: targetAge.data.filter((age) => age !== value),
        });
      }
    }
  }

  function handleAgeLimitChange(e: string): void {
    const val = e;
    setAgeLimit(val as WebtoonT["ageLimit"]);
  }

  async function handleSubmitClick(): Promise<void> {
    if (me == null) {
      return;
    }
    setIsSubmitting(true);
    const form: WebtoonFormT = {
      authorId: me.id,
      title,
      title_en,
      authorDetail,
      authorDetail_en,
      description,
      description_en,
      thumbPath: thumbnail,
      targetGender: targetGender === "male" || targetGender === "female" ? targetGender : null,
      targetAge,
      ageLimit: ageLimit === "12+" || ageLimit === "15+" || ageLimit === "18+" ? ageLimit : null,
      externalUrl,
    };
    try {
      await onSubmit(form, { genres });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (genres$.status === "idle" || genres$.status === "loading") {
    return (
      <Spinner />
    );
  }
  if (genres$.status === "error") {
    return (
      <ErrorComponent />
    );
  }

  return (
    <Col>
      <Row>
        <Label htmlFor="title">{TaddSeries("seriesTitle")}</Label>
        <Gap x={2} />
        <Text className="text-mint text-[10pt]">{locale === "ko" ? "*필수" : "*Required"}</Text>
      </Row>
      <Gap y={3} />
      <Input
        className="text-black"
        id="title"
        value={title}
        onChange={handleTitleChange}
        placeholder={TaddSeries("enterKoreanTitle")}
      />
      <Gap y={3} />
      <Input
        className="text-black"
        id="title_en"
        value={title_en}
        onChange={handleEnTitleChange}
        placeholder={TaddSeries("enterEnglishTitle")}
      />

      <Gap y={10} />

      <Label htmlFor='authorDetail'>{TaddSeries("authorOptional")}</Label>
      <Gap y={3} />
      <Input
        className="text-black"
        id="authorDetail"
        value={authorDetail}
        onChange={handleAuthorDetailChange}
        placeholder={TaddSeries("enterAuthor")}
      />
      <Gap y={3} />
      <Input
        className="text-black"
        id="authorDetail_en"
        value={authorDetail_en}
        onChange={handleAuthorDetailEnChange}
        placeholder={TaddSeries("enterAuthorEn")}
      />


      <Gap y={10} />

      <Label htmlFor="thumbnail">{TaddSeries("seriesImage")}</Label>
      <Gap y={3} />
      {thumbnail === null && (
        <>
          <Gap y={3} />
          <Label
            htmlFor="thumbnail"
            className="flex flex-col justify-center items-center bg-gray-darker rounded-sm h-[280px]"
          >
            <IconUpload className="fill-gray-text" />
            <Gap y={3} />
            <Text className="text-gray-text">
              {TaddSeries("pleaseUploadImage")}
            </Text>
          </Label>
          <Gap y={3} />
        </>
      )}
      {thumbnail != null && (
        <Label
          htmlFor="thumbnail"
          className="flex flex-col hover:border-red hover:border-2 rounded-sm cursor-pointer"
        >
          <img
            width="auto"
            draggable={false}
            src={buildImgUrl(null, thumbnail)}
            alt={thumbnail}
          />
        </Label>
      )}
      <Input
        className="invisible"
        id="thumbnail"
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleThumbnailChange}
      />
      <Gap y={10} />

      <Label htmlFor="description">{TaddSeries("seriesIntro")}</Label>
      <Gap y={3} />
      <div className="relative">
        <Textarea
          className="bg-white text-black"
          id="description"
          value={description || undefined}
          onChange={handleDescriptionChange}
          placeholder={TaddSeries("enterKoreanIntro")}
          maxLength={1000}
        />
        <Text className="absolute right-2 bottom-1 text-sm text-gray-text ">
          {description?.length || descCount}/1,000
        </Text>
      </div>
      <Gap y={3} />
      <div className="relative">
        <Textarea
          className="bg-white text-black"
          id="description_en"
          value={description_en || undefined}
          onChange={handleEnDescriptionChange}
          placeholder={TaddSeries("enterEnglishIntro")}
          maxLength={1000}
        />
        <Text className="absolute right-2 bottom-1 text-sm text-gray-text ">
          {description_en?.length || descCount_en}/1,000
        </Text>
      </div>
      <Gap y={10} />

      {/* <Label htmlFor="keyword">{TaddSeries("seriesKeywords")}</Label>
      <Gap y={3} />
      <Input
        className="text-black"
        id="keyword"
        value={keyword || undefined}
        onChange={handleKeywordChange}
        placeholder={TaddSeries("pleaseEnterKeywords")}
      />
      <Gap y={10} /> */}

      <Label htmlFor="url">{TaddSeries("seriesLink")}</Label>
      <Gap y={3} />
      <Input
        className="text-black"
        id="url"
        value={externalUrl}
        onChange={handleUrlChange}
        placeholder={TaddSeries("pleaseEnterLink")}
      />
      <Gap y={10} />

      {genres$.data.length > 0
        ? <>
          <Label htmlFor="genre">
            {locale === "ko" ? "작품 장르(최대 2개) : " : "Webtoon Genre (Max 2) : "}
          </Label>
          <Gap y={3} />
          <GenreSelector
            selected={genres}
            onGenreSelect={handleGenreSelect}
          />
          <Gap y={10} />
        </> : null}

      <Label htmlFor="targetAge">{TaddSeries("targetGender")}</Label>
      <Gap y={3} />
      <RadioGroup className="flex flex-row" value={targetGender === null ? "all" : targetGender || undefined} onValueChange={handleTargetGenderChange}>
        <Row className="flex flex-wrap">
          {TARGET_GENDER.map((item) => (
            <Row key={item.label}>
              <RadioGroupItem
                className="border border-white"
                value={item.value === null ? "all" : item.value}
                id={item.label}
              />
              <Gap x="5px" />
              <Label htmlFor={item.label}>{Tgender(item.label)}</Label>
              <Gap x="10px" />
            </Row>
          ))}
        </Row>
      </RadioGroup>
      <Gap y={10} />

      <Label htmlFor="targetAge">{TaddSeries("targetAge")}</Label>
      <Gap y={3} />
      <Row className="flex flex-wrap">
        {TARGET_AGE.map((item) => (
          <Row key={item.label}>
            <Checkbox
              className="border border-white"
              value={item.value || ""}
              checked={targetAge?.data.includes(item.value as "10-20" | "20-30" | "30-40" | "40-50" | "50-60")}
              id={item.label}
              onCheckedChange={(checked) => {
                handleTargetAgeChange(Boolean(checked), item.value as "10-20" | "20-30" | "30-40" | "40-50" | "50-60");
              }}
            />
            <Gap x="4px" />
            <Label htmlFor={item.label}>{
              Tage(item.label)}</Label>
            <Gap x="8px" />
          </Row>
        ))}
      </Row>
      <Gap y={10} />

      <Label htmlFor="targetAge">{TaddSeries("filmRating")}</Label>
      <Gap y={3} />
      <RadioGroup className="flex flex-row" value={ageLimit === null ? "all" : ageLimit || undefined} onValueChange={handleAgeLimitChange}>
        <Row className="flex flex-wrap">
          {AGE_LIMIT.map((item) => (
            <Row key={item.label}>
              <RadioGroupItem
                className="border border-white"
                value={item.value === null ? "all" : item.value}
                id={item.label}
              />
              <Gap x="4px" />
              <Label htmlFor={item.label}>{item.label === "전체" ? (locale === "ko" ? item.label : "All") : item.label}</Label>
              <Gap x="8px" />
            </Row>
          ))}
        </Row>
      </RadioGroup>
      <Gap y={10} />

      <Row className="justify-end">
        <Button
          disabled={submitDisabled}
          onClick={handleSubmitClick}
          className="bg-mint text-white hover:bg-mint/70"
        >
          {preWebtoon
            ? isSubmitting
              ? `${TaddSeries("editing")}`
              : `${TaddSeries("editSeries")}`
            : isSubmitting
              ? `${TaddSeries("registering")}`
              : `${TaddSeries("registerSeries")}`}
          <Gap x={2} />
          <IconRightBrackets className="fill-white" />
        </Button>
      </Row>

      <Gap y={40} />
    </Col>
  );
}
