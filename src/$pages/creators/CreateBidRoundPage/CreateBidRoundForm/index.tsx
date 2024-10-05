"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Text } from "@/ui/texts";
import { Col, Gap, Row } from "@/ui/layouts";
import { Input } from "@/ui/shadcn/Input";
import { Button } from "@/ui/shadcn/Button";
import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMe } from "@/states/UserState";
import { useRouter } from "next/navigation";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/Table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/Select";
import { IconDelete } from "@/components/svgs/IconDelete";
import { IconCross } from "@/components/svgs/IconCross";
import { Label } from "@/ui/shadcn/Label";
import * as BidRoundApi from "@/apis/bid_rounds";
import type { BidRoundFormT, WebtoonT } from "@/types";
import { Checkbox } from "@/ui/shadcn/CheckBox";
import { useLocale, useTranslations } from "next-intl";

const BRAND_NEW = [
  { element: "신작", value: "true", elementEnglish: "New Work" },
  { element: "구작", value: "false", elementEnglish: "Old Work" },
];
const ORIGINALITY = [
  { element: "예", value: "original", elementEnglish: "Yes" },
  { element: "아니오", value: "notOriginal", elementEnglish: "No" },
];

const HEADER_DATA = [
  { korean: "사업권 종류", english: "Type of Business Right" },
  { korean: "사업권 구분", english: "Business Right Classification" },
  { korean: "독점 권리", english: "Exclusive Rights" },
  { korean: "서비스 권역", english: "Service Region" },
  { korean: "삭제", english: "Delete" },
];

const EXCLUSIVE_RIGHTS_OPTIONS = [
  { label: "전체", value: "all", labelEnglish: "All" },
  { label: "영화", value: "movie", labelEnglish: "Movie" },
  { label: "드라마", value: "drama", labelEnglish: "Drama" },
  { label: "웹드라마", value: "webDrama", labelEnglish: "Web Drama" },
  { label: "PR영상", value: "ads", labelEnglish: "Ads" },
  { label: "뮤지컬", value: "musical", labelEnglish: "Musical" },
  { label: "게임", value: "game", labelEnglish: "Game" },
  { label: "출판", value: "book", labelEnglish: "Book" },
  { label: "굿즈", value: "product", labelEnglish: "Product" },
];
const COUNTRY_OPTIONS = [
  { label: "전체", value: "all", labelEnglish: "All" },
  { label: "국내", value: "ko", labelEnglish: "Local" },
  { label: "북미(영어)", value: "en", labelEnglish: "North America (English)" },
  { label: "중국(간체)", value: "zhCN", labelEnglish: "China (Simplified)" },
  { label: "대만(번체)", value: "zhTW", labelEnglish: "Taiwan (Traditional)" },
  { label: "독일", value: "de", labelEnglish: "Germany" },
  { label: "인도네시아", value: "id", labelEnglish: "Indonesia" },
  { label: "일본", value: "ja", labelEnglish: "Japan" },
  { label: "프랑스", value: "fr", labelEnglish: "France" },
  { label: "베트남", value: "vi", labelEnglish: "Vietnam" },
  { label: "말레이시아", value: "ms", labelEnglish: "Malaysia" },
  { label: "태국", value: "th", labelEnglish: "Thailand" },
  { label: "스페인", value: "es", labelEnglish: "Spain" },
];

type CreateBidRoundFormProps = {
  webtoon: WebtoonT;
};

type OfferRowT = {
  contractType: string | null;
  businessField: string | null;
  contract: string | null;
  country: string | null;
  // message: string | null;
};

function ContractTypeField({
  offerRow,
  setOfferRow,
  invalidFields,
  setInvalidFields,
}: {
  offerRow: OfferRowT[];
  setOfferRow: Dispatch<SetStateAction<OfferRowT[]>>;
  invalidFields: { index: number; field: string }[];
  setInvalidFields: Dispatch<
    SetStateAction<{ index: number; field: string }[]>
  >;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const locale = useLocale();

  function handleAddRowClick() {
    const newRow: OfferRowT = {
      contractType: "",
      businessField: "",
      contract: "",
      country: "",
      // message: "",
    };
    setOfferRow([...offerRow, newRow]);
  }

  function handleSelectChange(value: string, idx: number, key: string) {
    setOfferRow((prev) => {
      return prev.map((row, i) => {
        if (i !== idx) {
          return row;
        }

        const updatedRow = { ...row, [key]: value };

        if (key === "contractType") {
          switch (value) {
            case "웹툰 연재권":
              updatedRow.businessField = "webtoon";
              break;
            case "2차 사업권":
              updatedRow.businessField = "";
              break;
          }
        }

        return updatedRow;
      });
    });

    if (value !== null && value !== undefined && value !== "") {
      setInvalidFields((prevInvalidFields) =>
        prevInvalidFields.filter((f) => f.index !== idx || f.field !== key)
      );
    }
  }

  function handleDeleteRowClick(idx: number) {
    const newOfferRow = offerRow
      .filter((_, i) => i !== idx)
      .map((row, i) => ({ ...row, idx: i }));
    setOfferRow(newOfferRow);
  }

  return (
    <div>
      <Row className="justify-end">
        <Button className="bg-mint w-[120px]" onClick={handleAddRowClick}>
          <IconCross className="fill-white" />
          <Text className="text-white">{t("addItem")}</Text>
        </Button>
      </Row>
      <Gap y={3} />
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-dark">
            {HEADER_DATA.map((header, idx) => (
              <TableHead key={idx} className="text-center text-gray-text">
                {locale === "en" ? header.english : header.korean}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {offerRow.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-center w-[200px]">
                <Select
                  onValueChange={(e) => {
                    handleSelectChange(e, idx, "contractType");
                  }}
                >
                  <SelectTrigger
                    className={
                      invalidFields.some(
                        (invalidField) =>
                          invalidField.index === idx &&
                          invalidField.field === "contractType"
                      )
                        ? "border-red bg-gray-darker rounded-sm"
                        : "bg-gray-darker rounded-sm"
                    }
                  >
                    <SelectValue placeholder={t("selectTypeOfBusinessRight")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("typeOfBusinessRight")}</SelectLabel>
                      <SelectItem value="웹툰 연재권">
                        {t("webtoonSerialRights")}
                      </SelectItem>
                      <SelectItem value="2차 사업권">
                        {t("secondBusinessRight")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-center w-[200px]">
                {offerRow[idx].contractType === "웹툰 연재권" ? (
                  <Text>-</Text>
                ) : (
                  <Select
                    onValueChange={(e) => {
                      handleSelectChange(e, idx, "businessField");
                    }}
                  >
                    <SelectTrigger
                      className={
                        invalidFields.some(
                          (invalidField) =>
                            invalidField.index === idx &&
                            invalidField.field === "businessField"
                        )
                          ? "border-red bg-gray-darker rounded-sm"
                          : "bg-gray-darker rounded-sm"
                      }
                    >
                      <SelectValue
                        placeholder={t("selectBusinessRightClassifications")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>
                          {t("businessRightClassification")}
                        </SelectLabel>
                        {EXCLUSIVE_RIGHTS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {locale === "en"
                              ? option.labelEnglish
                              : option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}

                {/* <MultipleSelector
                  value={offerRow[idx].businessField}
                  onChange={(value) => {handleMultipleSelectorChange(value, idx, "businessField");}}
                  defaultOptions={EXCLUSIVE_RIGHTS_OPTIONS}
                  placeholder="사업권 구분"
                /> */}
              </TableCell>

              <TableCell className="text-center w-[200px]">
                <Select
                  onValueChange={(e) => {
                    handleSelectChange(e, idx, "contract");
                  }}
                >
                  <SelectTrigger
                    className={
                      invalidFields.some(
                        (invalidField) =>
                          invalidField.index === idx &&
                          invalidField.field === "contract"
                      )
                        ? "border-red bg-gray-darker rounded-sm"
                        : "bg-gray-darker rounded-sm"
                    }
                  >
                    <SelectValue placeholder={t("exclusiveRights")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("exclusiveRights")}</SelectLabel>
                      <SelectItem value="exclusive">
                        {t("exclusive")}
                      </SelectItem>
                      <SelectItem value="nonExclusive">
                        {t("nonExclusive")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-center w-[200px]">
                <Select
                  onValueChange={(e) => {
                    handleSelectChange(e, idx, "country");
                  }}
                >
                  <SelectTrigger
                    className={
                      invalidFields.some(
                        (invalidField) =>
                          invalidField.index === idx &&
                          invalidField.field === "country"
                      )
                        ? "border-red bg-gray-darker rounded-sm"
                        : "bg-gray-darker rounded-sm"
                    }
                  >
                    <SelectValue placeholder={t("serviceRegion")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("serviceRegion")}</SelectLabel>
                      {COUNTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {locale === "en" ? option.labelEnglish : option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-center w-[50px]">
                <Button
                  className="bg-red text-white hover:bg-red/70"
                  onClick={() => {
                    handleDeleteRowClick(idx);
                  }}
                >
                  <IconDelete className="fill-white" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EpisodeNowField({
  nowEpisode,
  setNowEpisode,
  doneEpisode,
  setDoneEpisode,
}: {
  nowEpisode: string;
  setNowEpisode: Dispatch<SetStateAction<string>>;
  doneEpisode: string;
  setDoneEpisode: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <Col className="p-5">
      <Label className="font-bold text-[13pt]">{t("serialInformation")}</Label>
      <Gap y={2} />
      <Row>
        <Input
          placeholder="_"
          value={nowEpisode || ""}
          onChange={(e) => {
            setNowEpisode(e.target.value);
          }}
          className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
        />
        <Gap x={2} />
        <Label>{t("currentEpisode")}</Label>
        <Gap x={4} />
        <Input
          placeholder="_"
          value={doneEpisode || ""}
          onChange={(e) => {
            setDoneEpisode(e.target.value);
          }}
          className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
        />
        <Gap x={2} />
        <Label>{t("expectingOrFinishedEpisode")}</Label>
      </Row>
    </Col>
  );
}

function DoneEpisode({
  doneEpisode,
  setDoneEpisode,
}: {
  doneEpisode: string;
  setDoneEpisode: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <Col className="p-5">
      <Label className="font-bold text-[13pt]">{t("serialInformation")}</Label>
      <Gap y={2} />
      <Row>
        <Input
          placeholder="_"
          value={doneEpisode || ""}
          onChange={(e) => {
            setDoneEpisode(e.target.value);
          }}
          className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
        />
        <Gap x={2} />
        <Label>{t("finishedEpisode")}</Label>
      </Row>
    </Col>
  );
}

function PossibleToMakeField({
  monthlyNumEpisode,
  setMonthlyNumEpisode,
}: {
  monthlyNumEpisode: string;
  setMonthlyNumEpisode: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <Col className="p-5">
      <Label className="font-bold text-[13pt]">
        {t("monthlyProductionAvailableRounds")}
      </Label>
      <Gap y={2} />
      <Row>
        <Input
          placeholder="_"
          value={monthlyNumEpisode || ""}
          onChange={(e) => {
            setMonthlyNumEpisode(e.target.value);
          }}
          className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
        />
        <Gap x={2} />
        <Label>{t("episodesPossible")}</Label>
      </Row>
    </Col>
  );
}

export function CreateBidRoundForm({ webtoon }: CreateBidRoundFormProps) {
  const router = useRouter();
  const me = useMe();
  const { enqueueSnackbar } = useSnackbar();
  const [isBrandNew, setIsBrandNew] = useState<string>("");
  const [originality, setOriginality] = useState<string>("");
  const [nowEpisode, setNowEpisode] = useState<string>("");
  const [doneEpisode, setDoneEpisode] = useState<string>("");
  const [monthlyNumEpisode, setMonthlyNumEpisode] = useState<string>("");
  const [offerRow, setOfferRow] = useState<OfferRowT[]>([]);
  const [invalidFields, setInvalidFields] = useState<
    { index: number; field: string }[]
  >([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const t = useTranslations("updateOrCreateBidRoundsPage");

  useEffect(() => {
    setOriginality("");
    setNowEpisode("");
    setDoneEpisode("");
    setMonthlyNumEpisode("");
  }, [isBrandNew]);

  function validateOfferRow(offerRow: OfferRowT[]) {
    const invalidFields: { index: number; field: string }[] = [];
    offerRow.forEach((row, index) => {
      Object.entries(row).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          invalidFields.push({ index, field: key });
        }
      });
    });
    return invalidFields;
  }

  async function onSubmit() {
    try {
      if (!isChecked) {
        enqueueSnackbar("약관에 동의해주세요", { variant: "error" });
        return;
      }
      if (offerRow.length > 0) {
        const settedInvalidFields = validateOfferRow(offerRow);
        setInvalidFields(settedInvalidFields);

        if (settedInvalidFields.length > 0) {
          enqueueSnackbar("필수 항목을 모두 입력해주세요", {
            variant: "error",
          });
          return;
        }

        const filteredOfferRow = offerRow.map(({ contractType, ...rest }) => ({
          ...rest,
          contract: rest.contract as "exclusive" | "nonExclusive" | "disallow",
          businessField: rest.businessField as
            | "all"
            | "webtoon"
            | "movie"
            | "drama"
            | "webDrama"
            | "ads"
            | "musical"
            | "game"
            | "book"
            | "product",
          country: rest.country as
            | "all"
            | "ko"
            | "en"
            | "zhCN"
            | "zhTW"
            | "de"
            | "id"
            | "ja"
            | "fr"
            | "vi"
            | "ms"
            | "th"
            | "es",
        }));

        const insertForm: BidRoundFormT = {
          isBrandNew: isBrandNew === "true" ? true : false,
          userId: me!.id,
          webtoonId: webtoon.id,
          status: "idle",
          originality: originality as "original" | "notOriginal",
          contractRange: { data: filteredOfferRow },
          nowEpisode: Number(nowEpisode),
          monthlyNumEpisode: Number(monthlyNumEpisode),
          numEpisode: Number(doneEpisode),
        };
        await BidRoundApi.create(insertForm);
        router.push(`/webtoons/${webtoon.id}`);
      } else {
        const insertForm: BidRoundFormT = {
          isBrandNew: isBrandNew === "true" ? true : false,
          userId: me!.id,
          webtoonId: webtoon.id,
          status: "idle",
          originality: originality as "original" | "notOriginal",
          contractRange: { data: [] },
          nowEpisode: Number(nowEpisode),
          monthlyNumEpisode: Number(monthlyNumEpisode),
          numEpisode: Number(doneEpisode),
        };
        await BidRoundApi.create(insertForm);
        router.push(`/webtoons/${webtoon.id}`);
      }
    } catch (e: any) {
      console.warn(e);
      const code = e.response.data.code;
      switch (code) {
      case "INVALID_FIELD":
        enqueueSnackbar("항목을 모두 입력해주세요", {
          variant: "error",
        });
        break;
      case "ALREADY_EXIST":
        enqueueSnackbar("이미 작품 거래 등록이 되어 있습니다.", {
          variant: "error",
        });
      default:
        enqueueSnackbar("알 수 없는 에러가 발생했습니다.", {
          variant: "error",
        });
      }
    }
  }

  function IsBrandNewField() {
    const locale = useLocale();
    return (
      <Col className="p-5">
        <Label className="font-bold text-[13pt]">{t("productType")}</Label>
        <Gap y={2} />
        <RadioGroup
          className="flex flex-wrap"
          onValueChange={(value) => {
            setIsBrandNew(value);
          }}
          defaultValue={isBrandNew || ""}
        >
          {BRAND_NEW.map((brandNew) => (
            <Row key={brandNew.element}>
              <RadioGroupItem
                className="border border-white"
                value={brandNew.value}
                id={brandNew.value}
              ></RadioGroupItem>
              <Label htmlFor={brandNew.value}>
                {locale === "en" ? brandNew.elementEnglish : brandNew.element}
              </Label>
              <Gap x={1} />
            </Row>
          ))}
        </RadioGroup>
      </Col>
    );
  }

  function OriginalityField() {
    const locale = useLocale();
    return (
      <Col className="p-5">
        <Label className="font-bold text-[13pt]">
          {t("SerializationOfOtherPlatforms")}
        </Label>
        <Gap y={2} />
        <RadioGroup
          className="flex flex-wrap"
          onValueChange={(event) => {
            setOriginality(event);
          }}
          defaultValue={originality || ""}
        >
          {ORIGINALITY.map((originality) => (
            <Row key={originality.value}>
              <RadioGroupItem
                className="border border-white"
                value={originality.value}
                id={originality.value}
              ></RadioGroupItem>
              <Label htmlFor={originality.value}>
                {locale === "en"
                  ? originality.elementEnglish
                  : originality.element}
              </Label>
              <Gap x={1} />
            </Row>
          ))}
        </RadioGroup>
      </Col>
    );
  }

  function SubmitButton({ onSubmit }: { onSubmit: () => void }) {
    return (
      <Row className="justify-end">
        <Button
          disabled={!isChecked}
          onClick={onSubmit}
          type="submit"
          className="rounded-full bg-mint text-white"
        >
          {t("register")}
          <Gap x={2} />
          <IconRightBrackets className="fill-white" />
        </Button>
      </Row>
    );
  }

  return (
    <Col>
      <Row>
        <Text className="text-[16pt] font-bold text-white">
          {t("generalInformation")}
        </Text>
        <Gap x={1} />
        <IconExclamation className="fill-white" />
      </Row>
      <IsBrandNewField />

      {isBrandNew === "true" && (
        <EpisodeNowField
          nowEpisode={nowEpisode}
          setNowEpisode={setNowEpisode}
          doneEpisode={doneEpisode}
          setDoneEpisode={setDoneEpisode}
        />
      )}
      {isBrandNew === "true" && (
        <PossibleToMakeField
          monthlyNumEpisode={monthlyNumEpisode}
          setMonthlyNumEpisode={setMonthlyNumEpisode}
        />
      )}
      {isBrandNew === "false" && (
        <DoneEpisode
          doneEpisode={doneEpisode}
          setDoneEpisode={setDoneEpisode}
        />
      )}

      <OriginalityField />

      <Gap y={20} />

      <Row>
        <Text className="text-[16pt] font-bold text-white">
          {t("currentStatusOfCopyrightAgreement")}
        </Text>
        <Gap x={1} />
        <IconExclamation className="fill-white" />
      </Row>

      <ContractTypeField
        offerRow={offerRow}
        setOfferRow={setOfferRow}
        invalidFields={invalidFields}
        setInvalidFields={setInvalidFields}
      />

      <Gap y={40} />
      <Gap y={20} />

      <Row className="gap-2 justify-center">
        <Label htmlFor="terms" className="text-white">
          {t("agreement")}
        </Label>
        <Checkbox
          id="terms"
          className="border border-white"
          onCheckedChange={(checked) => {
            setIsChecked(Boolean(checked));
          }}
        />
      </Row>

      <Gap y={20} />

      <SubmitButton onSubmit={onSubmit} />

      <Gap y={40} />
    </Col>
  );
}
