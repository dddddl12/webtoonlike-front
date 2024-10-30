"use client";

import React, { useEffect, useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Label } from "@/ui/shadcn/Label";
import { Input } from "@/ui/shadcn/Input";
import Image from "next/image";
import { ImageData } from "@/utils/media";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/shadcn/Select";
import MultipleSelector from "@/ui/shadcn/MultipleSelector";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { BuyerCompanyIndustry, BuyerCompanyType, BuyerFormT, BuyerT } from "@/resources/buyers/buyer.types";
import { Form, FormControl, FormField, FormItem } from "@/ui/shadcn/Form";
import Spinner from "@/components/Spinner";
import { createBuyer } from "@/resources/buyers/buyer.service";
import { useSession } from "@clerk/nextjs";
import { NotSignedInError } from "@/errors";


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
  prevBuyer?: BuyerT;
  redirectPath?: string;
}) {
  const router = useRouter();
  const prevBuyerCompany = prevBuyer?.companyInfo;
  const [thumbnail, setThumbnail] = useState<ImageData | undefined>(
    prevBuyerCompany?.thumbPath ? new ImageData(prevBuyerCompany?.thumbPath) : undefined);
  const [businessCert, setBusinessCert ] = useState<ImageData | undefined>(
    prevBuyerCompany?.businessCertPath ? new ImageData(prevBuyerCompany?.businessCertPath) : undefined);
  const [businessCard, setBusinessCard] = useState<ImageData | undefined>(
    prevBuyerCompany?.businessCardPath ? new ImageData(prevBuyerCompany?.businessCardPath) : undefined);

  const form = useForm<BuyerFormT>({
    defaultValues: {
      companyInfo: {
        name: prevBuyerCompany?.name || "",
        fieldType: prevBuyerCompany?.fieldType || [],
        businessType: prevBuyerCompany?.businessType || [],
        dept: prevBuyerCompany?.dept || "",
        position: prevBuyerCompany?.position || "",
        positionDetail: prevBuyerCompany?.positionDetail || "",
        businessNumber: prevBuyerCompany?.businessNumber || "",
        thumbnail: undefined,
        businessCert: undefined,
        businessCard: undefined,
      },
      purpose: prevBuyer?.purpose,
    }
  });

  // 필수 필드 체크
  const allValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  const checkRequiredFieldsFilled = (values: BuyerFormT) => {
    // TODO zod로 변경
    const { companyInfo } = values;
    return !!(companyInfo.name && companyInfo.businessNumber);
  };
  useEffect(() => {
    setAllRequiredFilled(checkRequiredFieldsFilled(allValues));
  }, [allValues]);

  const t = useTranslations("profilePage");
  const Tpurpose = useTranslations("purpose");

  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const { session, isLoaded, isSignedIn } = useSession();
  if (isLoaded && !isSignedIn) {
    throw new NotSignedInError();
  } else if (submissionInProgress || !isLoaded) {
    return <Spinner />;
  }
  return (
    <Col>
      <span className="text-black">{t("headerDesc")}</span>
      <Gap y={10} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(async (buyerForm) => {
          setSubmissionInProgress(true);
          await createBuyer(buyerForm);
          await session?.touch();
          setSubmissionInProgress(false);
          router.replace(redirectPath || "/");
        })}>
          <FormField
            control={form.control}
            name="companyInfo.businessNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    inputMode="numeric"
                    placeholder={t("businessRegPlaceholder") + " *"}
                  />
                  {/* TODO  필수 표시*/}
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="companyInfo.fieldType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/*  TODO*/}
                  <MultipleSelector
                    className="border-gray px-1 py-2 rounded-sm"
                    value={BUSINESS_FIELD_DATA.filter(
                      option => prevBuyerCompany?.fieldType.includes(option.value))}
                    onChange={field.onChange}
                    defaultOptions={BUSINESS_FIELD_DATA}
                    placeholder={t("businessFieldPlaceholder") + " (멀티셀렉트 재구현 예정)"}
                    hidePlaceholderWhenSelected
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="companyInfo.businessType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultipleSelector
                    className="border-gray px-1 py-2 rounded-sm"
                    value={BUSINESS_TYPE_DATA.filter(
                      option => prevBuyerCompany?.businessType.includes(option.value))}
                    onChange={field.onChange}
                    defaultOptions={BUSINESS_TYPE_DATA}
                    placeholder={t("occupationPlaceholder")}
                    hidePlaceholderWhenSelected
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Row className="justify-between">
            <Label htmlFor="businessCert"
              className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
              <Text className="text-[#94A4B8]  text-[10pt]">
                {businessCert?.url || t("uploadBusinessReg")}
              </Text>
              <Label htmlFor="businessCert"
                className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
            </Label>

            <FormField
              control={form.control}
              name="companyInfo.businessCert"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="hidden h-0 border border-red"
                      type='file'
                      accept='image/jpeg, image/png'
                      onChange={(e) => {
                        const newFile = e.target.files?.[0];
                        if (newFile) {
                          setBusinessCert(new ImageData(newFile));
                        }
                        field.onChange(e);
                      }}
                      value={undefined}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

          </Row>

          <Gap y={10}/>

          <hr className="border-gray"/>

          <Gap y={10}/>

          <FormField
            control={form.control}
            name="companyInfo.name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertCompanyName") + " *"}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

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
              <Label htmlFor="thumbnail"
                className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
                <Text className="text-[#94A4B8]  text-[10pt]">
                  {thumbnail?.url || t("insertCompanyLogo")}
                </Text>
                <Label htmlFor="thumbnail"
                  className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
              </Label>
            </Col>
            <FormField
              control={form.control}
              name="companyInfo.thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="hidden h-0 border border-red"
                      type='file'
                      accept='image/jpeg, image/png'
                      onChange={(e) => {
                        const newFile = e.target.files?.[0];
                        if (newFile) {
                          setThumbnail(new ImageData(newFile));
                        }
                        field.onChange(e);
                      }}
                      value={undefined}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Row>

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="companyInfo.dept"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertBusinessUnit")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="companyInfo.position"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertBusinessPosition")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="companyInfo.positionDetail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertInChargeOf")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Row className="justify-between">
            <Label htmlFor="businessCard"
              className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
              <Text className="text-[#94A4B8]  text-[10pt]">
                {businessCard?.url || t("attachEmploymentCert")}
              </Text>
              <Label htmlFor="businessCard"
                className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
            </Label>
            <FormField
              control={form.control}
              name="companyInfo.businessCard"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="hidden h-0 border border-red"
                      type='file'
                      accept='image/jpeg, image/png'
                      onChange={(e) => {
                        const newFile = e.target.files?.[0];
                        if (newFile) {
                          setBusinessCard(new ImageData(newFile));
                        }
                        field.onChange(e);
                      }}
                      value={undefined}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Row>

          <Gap y={10}/>

          <hr className="border-gray"/>

          <Gap y={10}/>

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select defaultValue={prevBuyer?.purpose ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-white border-gray text-[#94A4B8] rounded-sm">
                      <SelectValue placeholder={t("goals")}/>
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

                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Input
            type="submit"
            className="w-full bg-black-texts text-white hover:text-black"
            value={prevBuyer ? `${t("edit")}` : `${t("submit")}`}
            disabled={!allRequiredFilled}
          />
        </form>
      </Form>
    </Col>
  );
}