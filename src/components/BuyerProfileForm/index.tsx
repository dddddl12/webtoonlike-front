"use client";

import React, { useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Label } from "@/ui/shadcn/Label";
import { Input } from "@/ui/shadcn/Input";
import Image from "next/image";
import { ImageData } from "@/utils/media";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/shadcn/Select";
import MultipleSelector from "@/ui/shadcn/MultipleSelector";
import { useTranslations } from "next-intl";
import { BuyerCompanyIndustry, BuyerCompanyType, BuyerFormT, BuyerT } from "@backend/types/Buyer";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";


const BUSINESS_FIELD_DATA: {
  label: string;
  value: BuyerCompanyIndustry;
}[] = [
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

const BUSINESS_TYPE_DATA: {
  label: string;
  value: BuyerCompanyType;
}[] = [
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

export function BuyerProfileForm({ prevBuyer, redirectPath } : {
  prevBuyer?: BuyerT
  redirectPath?: string;
}) {
  const router = useRouter();
  const prev = prevBuyer?.companyInfo;
  const [thumbnail, setThumbnail] = useState<ImageData | undefined>(
    prev?.thumbPath ? new ImageData(prev?.thumbPath) : undefined);
  const [businessCert, setBusinessCert ] = useState<ImageData | undefined>(
    prev?.businessCertPath ? new ImageData(prev?.businessCertPath) : undefined);
  const [businessCard, setBusinessCard] = useState<ImageData | undefined>(
    prev?.businessCardPath ? new ImageData(prev?.businessCardPath) : undefined);
  const [purpose, setPurpose] = useState<string | undefined>(prevBuyer?.purpose);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerFormT>();

  const t = useTranslations("profilePage");
  const Tpurpose = useTranslations("purpose");

  return (
    <Col>
      <span className="text-black">{t("headerDesc")}</span>
      <Gap y={10} />

      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <Input
          {...register("companyInfo.businessNumber")}
          className="border-gray"
          type='text'
          inputMode="numeric"
          pattern="[0-9]"
          placeholder={t("businessRegPlaceholder")}
          value={prev?.businessNumber ?? ""}
        />

        <Gap y={5} />

        <MultipleSelector
          className="border-gray px-1 py-2 rounded-sm"
          value={BUSINESS_FIELD_DATA.filter(
            option => prev?.fieldType.includes(option.value))}
          // onChange={handleCompanyTypeChange}
          defaultOptions={BUSINESS_FIELD_DATA}
          placeholder={t("businessFieldPlaceholder")}
          hidePlaceholderWhenSelected
        />

        <Gap y={5} />

        <MultipleSelector
          className="border-gray px-1 py-2 rounded-sm"
          value={BUSINESS_TYPE_DATA.filter(
            option => prev?.businessType.includes(option.value))}
          // onChange={handleOccupationChange}
          defaultOptions={BUSINESS_TYPE_DATA}
          placeholder={t("occupationPlaceholder")}
          hidePlaceholderWhenSelected
        />

        <Gap y={5} />

        <Row className="justify-between">
          <Label htmlFor="businessCert" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
            <Text className="text-[#94A4B8]  text-[10pt]">
              {businessCert?.url || t("uploadBusinessReg")}
            </Text>
            <Label htmlFor="businessCert" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
          </Label>
          <Input
            {...register("companyInfo.businessCert")}
            className="hidden h-0 border border-red"
            id="businessCert"
            type='file'
            accept='image/jpeg, image/png'
            onChange={(e) => {
              const newFile = e.target.files?.[0];
              if (newFile) {
                setBusinessCert(new ImageData(newFile));
              }
            }}
          />
        </Row>

        <Gap y={10} />

        <hr className="border-gray" />

        <Gap y={10} />

        <Input
          {...register("companyInfo.name")}
          className="border-gray"
          type='text'
          placeholder={t("insertCompanyName")}
          value={prev?.name}
        />

        <Gap y={5} />

        <Row className="justify-between">
          <Col className="w-full justify-center items-center">
            {thumbnail && <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
              <Image
                draggable={false}
                priority
                src={thumbnail.url}
                alt={"thumbnail"}
                className="bg-white "
                style={{ objectFit: "cover" }}
                fill
              />
              <Gap y={5}/>
            </div>}
            <Label htmlFor="thumbnail" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
              <Text className="text-[#94A4B8]  text-[10pt]">
                {thumbnail?.url || t("insertCompanyLogo")}
              </Text>
              <Label htmlFor="thumbnail" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
            </Label>
          </Col>
          <Input
            {...register("companyInfo.thumbnail")}
            className="hidden h-0 border border-red"
            id="thumbnail"
            type='file'
            accept='image/jpeg, image/png'
            onChange={(e) => {
              const newFile = e.target.files?.[0];
              if (newFile) {
                setThumbnail(new ImageData(newFile));
              }
            }}
          />
        </Row>

        <Gap y={5} />

        <Input
          {...register("companyInfo.dept")}
          className="border-gray"
          type='text'
          placeholder={t("insertBusinessUnit")}
          value={prev?.dept}
        />

        <Gap y={5} />

        <Input
          {...register("companyInfo.position")}
          className="border-gray"
          type='text'
          placeholder={t("insertBusinessPosition")}
          value={prev?.position}
        />

        <Gap y={5} />

        <Input
          {...register("companyInfo.positionDetail")}
          className="border-gray"
          type='text'
          placeholder={t("insertInChargeOf")}
          value={prev?.positionDetail}
        />

        <Gap y={5} />

        <Row className="justify-between">
          <Label htmlFor="businessCard" className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
            <Text className="text-[#94A4B8]  text-[10pt]">
              {businessCard?.url || t("attachEmploymentCert")}
            </Text>
            <Label htmlFor="businessCard" className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
          </Label>
          <Input
            {...register("companyInfo.businessCard")}
            className="hidden h-0"
            id="businessCard"
            type='file'
            accept='image/jpeg, image/png'
            onChange={(e) => {
              const newFile = e.target.files?.[0];
              if (newFile) {
                setBusinessCard(new ImageData(newFile));
              }
            }}
          />
        </Row>

        <Gap y={10} />

        <hr className="border-gray" />

        <Gap y={10} />

        <Select defaultValue={prevBuyer ? `${prevBuyer.purpose}` : ""}
          // onValueChange={handlePurposeChange}
        >
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

        <Input type="submit" className="w-full bg-black-texts text-white hover:text-black">
          {prevBuyer ? `${t("edit")}` : `${t("submit")}`}
        </Input>
      </form>
      <Gap y={40} />
    </Col>
  );
}