"use client";

import { Col, Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { ChangeEvent, useState } from "react";
import * as BidRequestApi from "@/apis/bid_request";
import { useSnackbar } from "notistack";
import { Heading, Text } from "@/ui/texts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/Table";
import { IconCross } from "../svgs/IconCross";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/Select";
import { Textarea } from "@/ui/shadcn/Textarea";
import { IconRightBrackets } from "../svgs/IconRightBrackets";
import { IconDelete } from "../svgs/IconDelete";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getServerUserInfo } from "@/utils/auth/server";
import { BidRoundT } from "@backend/types/BidRound";
import { BidRequestFormT } from "@backend/types/BidRequest";

type BuyerBidRoundRequestFormPropsT = {
  bidRound: BidRoundT;
};

type OfferRowT = {
  contractType: string | null;
  businessField: string | null;
  contract: string | null;
  country: string | null;
  message: string | null;
};

const HEADER_DATA = [
  "사업권 종류",
  "사업권 구분",
  "독점 권리",
  "서비스 권역",
  "계약 조건",
  "삭제",
];

const EXCLUSIVE_RIGHTS_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "영화", value: "movie" },
  { label: "드라마", value: "drama" },
  { label: "웹드라마", value: "webDrama" },
  { label: "광고", value: "ads" },
  { label: "뮤지컬", value: "musical" },
  { label: "게임", value: "game" },
  { label: "도서", value: "book" },
  { label: "상품", value: "product" },
];
const COUNTRY_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "국내", value: "ko" },
  { label: "북미(영어)", value: "en" },
  { label: "중국(간체)", value: "zhCN" },
  { label: "대만(번체)", value: "zhTW" },
  { label: "일본", value: "ja" },
  { label: "프랑스", value: "fr" },
  { label: "스페인", value: "es" },
  { label: "베트남", value: "vi" },
  { label: "말레이시아", value: "ms" },
  { label: "태국", value: "th" },
];

export function BuyerBidRoundRequestForm({
  bidRound,
}: BuyerBidRoundRequestFormPropsT) {
  const user = getServerUserInfo();
  const router = useRouter();
  const [offerRow, setOfferRow] = useState<OfferRowT[]>([
    {
      contractType: null,
      businessField: null,
      contract: null,
      country: null,
      message: null
    }]);
  const [toCreator, setToCreator] = useState("");
  const [invalidFields, setInvalidFields] = useState<{index: number, field: string}[]>([]);
  const TmakeOffer = useTranslations("makeAnOffer");
  const TheaderData = useTranslations("offerHeaderData");
  const TtypeRights = useTranslations("typeBusinessRight");
  const TbusinessClassification = useTranslations(
    "businessRightClassification"
  );
  const TcountryOptions = useTranslations("countryOptions");


  const { enqueueSnackbar } = useSnackbar();

  function handleAddRowClick() {
    const newRow: OfferRowT = {
      contractType: "",
      businessField: "",
      contract: "",
      country: "",
      message: "",
    };
    setOfferRow([...offerRow, newRow]);
  }

  function handleDeleteRowClick(idx: number) {
    const newOfferRow = offerRow
      .filter((_, i) => i !== idx)
      .map((row, i) => ({ ...row, idx: i }));
    setOfferRow(newOfferRow);
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
      setInvalidFields(prevInvalidFields => prevInvalidFields.filter(f => f.index !== idx || f.field !== key));
    }
  }

  function handleContractConditionChange(
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ) {
    const val = String(e.target.value);
    setOfferRow((prev) => {
      const result = prev.map((row, i) => {
        if (i === idx) {
          return { ...row, message: val };
        }
        return row;
      });
      return result;
    });

    if (e.target.value !== null && e.target.value !== undefined && e.target.value !== "") {
      setInvalidFields(prevInvalidFields => prevInvalidFields.filter(f => f.index !== idx || f.field !== "message"));
    }
  }

  function handleToCreatorChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setToCreator(e.target.value);
  }

  function validateOfferRow(offerRow: OfferRowT[]) {
    const invalidFields: {index: number, field: string}[] = [];
    offerRow.forEach((row, index) => {
      Object.entries(row).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          invalidFields.push({ index, field: key });
        }
      });
    });
    return invalidFields;
  }

  async function handleSubmitClick() {
    const settedInvalidFields = validateOfferRow(offerRow);
    setInvalidFields(settedInvalidFields);

    if (settedInvalidFields.length > 0) {
      enqueueSnackbar("필수 항목을 모두 입력해주세요", { variant: "error" });
      return;
    }

    const filteredOfferRow = offerRow.map(({ contractType, ...rest }) => ({
      ...rest,
      contract: rest.contract as "exclusive" | "nonExclusive" | "disallow",
      businessField: rest.businessField as "all" | "webtoon" | "movie" | "drama" | "webDrama" | "ads" | "musical" | "game" | "book" | "product",
      country: rest.country as "all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es",
      message: rest.message as string,
    }));

    const form:BidRequestFormT = {
      userId: user.id,
      roundId: bidRound.id,
      contractRange: {
        data: filteredOfferRow
      },
    };
    toCreator.length > 0 && (form.message = toCreator);
    try {
      const rsp = await BidRequestApi.create(form);
      router.push("/buyer/bid-round-requests");
      enqueueSnackbar("bid request successfully created!", { variant: "success" });
    } catch (e) {
      console.log(e);
      enqueueSnackbar("bid request create error", { variant: "error" });
    }
  }

  return (
    <Col>
      <Heading className="font-bold text-[20pt]">
        {TmakeOffer("makeOffer")}
      </Heading>
      <Gap y={20} />
      <Button className="bg-mint w-[120px]" onClick={handleAddRowClick}>
        <IconCross className="fill-white" />
        <Text className="text-white">{TmakeOffer("addItem")}</Text>
      </Button>
      <Gap y={5} />
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-dark">
            {HEADER_DATA.map((header, idx) => (
              <TableHead key={idx} className="text-center text-gray-text">
                {TheaderData(header)}
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
                    <SelectValue
                      placeholder={TmakeOffer("typeOfBusinessRight")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {TmakeOffer("typeOfBusinessRight")}
                      </SelectLabel>
                      <SelectItem value="웹툰 연재권">
                        {TtypeRights("webtoonRights")}
                      </SelectItem>
                      <SelectItem value="2차 사업권">
                        {TtypeRights("secondaryRights")}
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
                        placeholder={TmakeOffer("businessRightClassification")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>
                          {TmakeOffer("businessRightClassification")}
                        </SelectLabel>
                        {EXCLUSIVE_RIGHTS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {TbusinessClassification(option.label)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
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
                    <SelectValue placeholder={TmakeOffer("exclusiveRights")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{TmakeOffer("exclusiveRights")}</SelectLabel>
                      <SelectItem value="exclusive">
                        {TmakeOffer("exclusive")}
                      </SelectItem>
                      <SelectItem value="nonExclusive">
                        {TmakeOffer("nonExclusive")}
                      </SelectItem>
                      {/* <SelectItem value="disallow">불허</SelectItem> */}
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
                    <SelectValue placeholder={TmakeOffer("serviceRegion")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{TmakeOffer("serviceRegion")}</SelectLabel>
                      {COUNTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {TcountryOptions(option.label)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-center w-[200px]">
                <Input
                  placeholder={TmakeOffer("contractConditionDesc")}
                  value={offerRow[idx].message || ""}
                  onChange={(event) => {
                    handleContractConditionChange(event, idx);
                  }}
                  className={
                    invalidFields.some(
                      (invalidField) =>
                        invalidField.index === idx &&
                        invalidField.field === "message"
                    )
                      ? "border-red bg-gray-darker placeholder:text-white"
                      : "bg-gray-darker placeholder:text-white"
                  }
                />
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

      <Gap y={20} />

      <Col>
        <Text className="text-white text-[18pt] font-bold">
          {TmakeOffer("toCreator")}
        </Text>
        <Gap y={5} />
        <Textarea
          className="placeholder:text-white border-none"
          onChange={handleToCreatorChange}
          placeholder={TmakeOffer("inputAdditionalRequirements")}
        />
        <Gap y={2} />
        <Text className="text-[10pt] text-gray-shade">
          {TmakeOffer("note")}
        </Text>
      </Col>

      <Gap y={20} />
      <Button
        className="ml-auto w-[80px] rounded-full bg-gray-dark text-white"
        onClick={handleSubmitClick}
      >
        {TmakeOffer("next")}
        <Gap x={2} />
        <IconRightBrackets className="fill-white" />
      </Button>
    </Col>
  );
}
