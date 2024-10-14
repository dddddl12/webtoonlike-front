"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Label } from "@/ui/shadcn/Label";
import { Input } from "@/ui/shadcn/Input";
import { Button } from "@/ui/shadcn/Button";
import * as BuyerApi from "@/apis/buyers";
import { uploadToS3 } from "@/utils/s3";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/shadcn/Select";
import MultipleSelector from "@/ui/shadcn/MultipleSelector";
import { useTranslations } from "next-intl";
import type { BuyerFormT, BuyerT } from "@backend/types/Buyer";


type BuyerProfileFormProps = {
  buyer?: BuyerT
  onSubmit: (form: BuyerFormT) => any
}

type Option = {
  label: string;
  value: string;
}

const NATION_DATA = [
  "대한민국",
  "미국",
  "중국",
  "대만",
  "일본",
  "프랑스",
  "스페인",
  "베트남",
  "말레이시아",
  "태국",
  "기타"
];

const BUSINESS_FIELD_DATA = [
  { label: "웹툰", value: "webtoon" },
  { label: "게임", value: "game" },
  { label: "영화", value: "movie" },
  { label: "드라마", value: "drama" },
  { label: "웹드라마", value: "webDrama" },
  { label: "영상", value: "video" },
  { label: "출판", value: "book" },
  { label: "공연", value: "performance" },
  { label: "기타", value: "etc" }
];

const OCCUPATION_DATA = [
  { label: "제작사", value: "creator" },
  { label: "투자사", value: "investor" },
  { label: "에이전트", value: "agent" },
  { label: "플랫폼사", value: "platform" },
  { label: "OTT", value: "ott" },
  { label: "매니지먼트", value: "management" },
  { label: "기타", value: "etc" }
];

const PURPOSE_DATA = [
  "privateContract",
  "publicContract",
  "publish",
  "secondaryProperty",
  "investment",
];

export function BuyerProfileForm({
  buyer: prevBuyer,
  onSubmit,
} : BuyerProfileFormProps) {
  const [businessNumber, setBusinessNumber] = useState<string | null>(null);
  const [companyType, setCompanyType] = useState<Option[] | null>(null);
  const [occupation, setOccupation] = useState<Option[] | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyDept, setCompanyDept] = useState<string | null>(null);
  const [companyPosition, setCompanyPosition] = useState<string | null>(null);
  const [companyPositionDetail, setCompanyPositionDetail] = useState<string | null>(null);
  const [businessCert, setBusinessCert ] = useState<File | string | null>();
  const [businessCard, setBusinessCard] = useState<File | string | null>();
  const [thumbnail, setThumbnail] = useState<File | string | null>();
  const [purpose, setPurpose] = useState<string | null>(null);

  const t = useTranslations("profilePage");
  const Tpurpose = useTranslations("purpose");

  useEffect(() => {
    if (prevBuyer) {
      const data = prevBuyer.companyInfo;
      setBusinessNumber(data.businessNumber ?? null);
      setCompanyType(data.fieldType?.map((item) => ({ label: item, value: item })) ?? null);
      setOccupation(data.businessType?.map((item) => ({ label: item, value: item })) ?? null);
      setBusinessCert(data.businessCertPath ?? null);
      setCompanyName(data.name ?? null);
      setThumbnail(data.thumbPath);
      setCompanyDept(data.dept ?? null);
      setCompanyPosition(data.position ?? null);
      setCompanyPositionDetail(data.positionDetail ?? null);
      setBusinessCard(data.businessCardPath ?? null);
      setPurpose(prevBuyer.purpose ?? null);
    }
  }, [prevBuyer?.userId]);

  function handleBusinessNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setBusinessNumber(val);
  }

  function handleCompanyTypeChange(value: Option[]): void {
    setCompanyType(value);
  }

  function handleOccupationChange(value: Option[]): void {
    setOccupation(value);
  }

  function handleCompanyNameChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCompanyName(val);
  }

  function handleCompanyDeptChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCompanyDept(val);
  }

  function handleCompanyPositionChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCompanyPosition(val);
  }

  function handleCompanyPositionDetailChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCompanyPositionDetail(val);
  }

  function handlePurposeChange(value: string): void {
    setPurpose(value);
  }

  async function onBusinessRegistrationChange(
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length == 0) {
      return;
    }
    const newFile = newFiles[0];
    setBusinessCert(newFile);
  }

  async function onThumbnailChange(
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length == 0) {
      return;
    }
    const newFile = newFiles[0];
    setThumbnail(newFile);
  }

  async function onBusinessCardChange(
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length == 0) {
      return;
    }
    const newFile = newFiles[0];
    setBusinessCard(newFile);
  }

  function purposeConverter(value: string) {
    const purposeMap = {
      "privateContract": "독점",
      "publicContract": "비독점",
      "publish": "콘텐츠 유통",
      "secondaryProperty": "2차 판권",
      "investment": "투자",
    };

    return purposeMap[value as keyof typeof purposeMap];
  }

  async function handleSubmitClick() {
    let thumbPath: string|null = null;
    if (thumbnail instanceof File) {
      const { putUrl, key } = await BuyerApi.getThumbnailPresignedUrl(thumbnail.type);
      await uploadToS3(putUrl, thumbnail);
      thumbPath = key;
    } else {
      thumbPath = thumbnail ?? null;
    }

    let businessCertPath: string|null = null;
    if (businessCert instanceof File) {
      const { putUrl, key } = await BuyerApi.getThumbnailPresignedUrl(businessCert.type);
      await uploadToS3(putUrl, businessCert);
      businessCertPath = key;
    } else {
      businessCertPath = businessCert ?? null;
    }

    let businessCardPath: string|null = null;
    if (businessCard instanceof File) {
      const { putUrl, key } = await BuyerApi.getThumbnailPresignedUrl(businessCard.type);
      await uploadToS3(putUrl, businessCard);
      businessCardPath = key;
    } else {
      businessCardPath = businessCard ?? null;
    }

    const form: BuyerFormT = {
      companyInfo: {
        thumbPath: thumbPath ?? "", // 프로필 이미지
        fieldType: companyType?.map((item) => item.value) as ("webtoon" | "game" | "movie" | "drama" | "webDrama" | "video" | "book" | "performance" | "etc")[], // 업체 분야
        businessType: occupation?.map((item) => item.value) as ("creator" | "investor" | "agent" | "platform" | "ott" | "management" | "etc")[], // 직종/업종
        name: companyName ?? "", // 회사명
        dept: companyDept, // 부서명
        position: companyPosition, // 직위
        positionDetail: companyPositionDetail, // 담당업무
        businessNumber: businessNumber ?? "", // 사업자등록번호
        businessCertPath: businessCertPath ?? "", // 사업자등록증
        businessCardPath: businessCardPath ?? "", // 재직증명서 || 명함
      },
      purpose: purpose as (("privateContract" | "publicContract" | "publish" | "secondaryProperty" | "investment") | null),
      // likeGenre: genre?.map((item) => item.value).join(","),
    };

    onSubmit(form);
  }

  return (
    <Col>
      <span className="text-black">{t("headerDesc")}</span>
      <Gap y={10} />

      <Input
        className="border-gray"
        type='text'
        inputMode="numeric"
        pattern="[0-9]"
        placeholder={t("businessRegPlaceholder")}
        value={businessNumber ?? ""}
        onChange={handleBusinessNumberChange}
      />

      <Gap y={5} />

      <MultipleSelector
        className="border-gray px-1 py-2 rounded-sm"
        value={companyType ?? []}
        onChange={handleCompanyTypeChange}
        defaultOptions={BUSINESS_FIELD_DATA}
        placeholder={t("businessFieldPlaceholder")}
        hidePlaceholderWhenSelected
      />

      <Gap y={5} />

      <MultipleSelector
        className="border-gray px-1 py-2 rounded-sm"
        value={occupation ?? []}
        onChange={handleOccupationChange}
        defaultOptions={OCCUPATION_DATA}
        placeholder={t("occupationPlaceholder")}
        hidePlaceholderWhenSelected
      />

      <Gap y={5} />

      <Row className="justify-between">
        {businessCert != null
          ? <Label htmlFor="businessCert" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
            <Text className="text-[#94A4B8] text-[10pt]">
              {(businessCert instanceof File) ? businessCert.name : buildImgUrl(null, businessCert)}
            </Text>
            <Label htmlFor="businessCert" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
          </Label>
          :
          <Label htmlFor="businessCert" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
            <Text className="text-[#94A4B8]  text-[10pt]">{t("uploadBusinessReg")}</Text>
            <Label htmlFor="businessCert" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
          </Label>
        }
        <Input
          className="hidden h-0 border border-red"
          id="businessCert"
          type='file'
          accept='image/jpeg, image/png'
          onChange={onBusinessRegistrationChange}
        />
      </Row>

      <Gap y={10} />

      <hr className="border-gray" />

      <Gap y={10} />

      <Input
        className="  border-gray"
        type='text'
        placeholder={t("insertCompanyName")}
        value={companyName ?? ""}
        onChange={handleCompanyNameChange}
      />

      <Gap y={5} />

      <Row className="justify-between">
        {thumbnail != null
          ? <>
            {(thumbnail instanceof File)
              ? <Col className="w-full justify-center items-center">
                {thumbnail &&
                  <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
                    <Image
                      draggable={false}
                      priority
                      src={URL.createObjectURL(thumbnail)}
                      alt={"thumbnail"}
                      className="bg-white "
                      style={{ objectFit: "cover" }}
                      fill
                    />
                    <Gap y={5} />
                  </div>
                }
                <Label htmlFor="thumbnail" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
                  <Text className="text-[#94A4B8]  text-[10pt]">
                    {(thumbnail instanceof File) && thumbnail.name}
                  </Text>
                  <Label htmlFor="thumbnail" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
                </Label>
              </Col>
              :
              <Col className="w-full justify-center items-center">
                <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
                  <Image
                    draggable={false}
                    priority
                    src={buildImgUrl(null, thumbnail)}
                    alt={"thumbnail"}
                    className="bg-white "
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
                <Gap y={5} />
                <Label htmlFor="thumbnail" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
                  <Text className="text-[#94A4B8]  text-[10pt]">
                    {buildImgUrl(null, thumbnail)}
                  </Text>
                  <Label htmlFor="thumbnail" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
                </Label>
              </Col>
            }
          </>
          :
          <Label htmlFor="thumbnail" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer
          ">
            <Text className="text-[#94A4B8]  text-[10pt]">{t("insertCompanyLogo")}</Text>
            <Label htmlFor="thumbnail" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">파일 선택</Label>
          </Label>
        }
        <Input
          className="hidden h-0 border border-red"
          id="thumbnail"
          type='file'
          accept='image/jpeg, image/png'
          onChange={onThumbnailChange}
        />
      </Row>

      <Gap y={5} />

      <Input
        className="  border-gray"
        type='text'
        placeholder={t("insertBusinessUnit")}
        value={companyDept ?? ""}
        onChange={handleCompanyDeptChange}
      />

      <Gap y={5} />

      <Input
        className="  border-gray"
        type='text'
        placeholder={t("insertBusinessPosition")}
        value={companyPosition ?? ""}
        onChange={handleCompanyPositionChange}
      />

      <Gap y={5} />

      <Input
        className="  border-gray"
        type='text'
        placeholder={t("insertInChargeOf")}
        value={companyPositionDetail ?? ""}
        onChange={handleCompanyPositionDetailChange}
      />

      <Gap y={5} />

      <Row className="justify-between">
        {businessCard != null
          ? <Label htmlFor="businessCard" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
            <Text className="text-[#94A4B8]  text-[10pt]">
              {(businessCard instanceof File) ? businessCard.name : buildImgUrl(null, businessCard)}
            </Text>
            <Label htmlFor="businessCard" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
          </Label>
          :
          <Label htmlFor="businessCard" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
            <Text className="text-[#94A4B8]  text-[10pt]">{t("attachEmploymentCert")}</Text>
            <Label htmlFor="businessCard" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
          </Label>
        }
        <Input
          className="hidden h-0"
          id="businessCard"
          type='file'
          accept='image/jpeg, image/png'
          onChange={onBusinessCardChange}
        />
      </Row>

      <Gap y={10} />

      <hr className="border-gray" />

      <Gap y={10} />

      <Select defaultValue={prevBuyer ? `${prevBuyer.purpose}` : ""} onValueChange={handlePurposeChange}>
        <SelectTrigger className="bg-white border-gray text-[#94A4B8] rounded-sm">
          <SelectValue placeholder={prevBuyer ? `${Tpurpose(prevBuyer.purpose || "")}` : `${t("goals")}`}>
            {purpose ? Tpurpose(purpose) : ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PURPOSE_DATA.map((item) => (
            <SelectItem
              key={item} value={item}>
              {Tpurpose(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Gap y={5} />

      <Button className="w-full bg-black-texts text-white hover:text-black" onClick={handleSubmitClick}>
        {prevBuyer ? `${t("edit")}` : `${t("submit")}`}
      </Button>
      <Gap y={40} />
    </Col>
  );
}