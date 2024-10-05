"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Text } from "@/ui/texts";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { BuyerBidRoundRequestForm } from "@/components/BuyerBidRoundRequestForm";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { Label } from "@/ui/shadcn/Label";
import { Input } from "@/ui/shadcn/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/Table";
import { businessFieldConverterToEn, businessFieldConverterToKr } from "@/utils/businessFieldConverter";
import { nationConverter, nationConverterToKr } from "@/utils/nationConverter";
import { extractAuthorName, extractAuthorNameEn } from "@/utils/webtoon";
import { BidRoundT, WebtoonT } from "@/types";

type BuyerBidRoundItemDetailPropsT = {
  bidRound: BidRoundT;
  webtoon: WebtoonT
};

export function BuyerBidRoundItemDetail({
  bidRound,
  webtoon,
}: BuyerBidRoundItemDetailPropsT) {
  const locale = useLocale();
  const t = useTranslations("personalInformation");
  const tcontractRangeData = useTranslations("contractRangeData");

  return (
    <Container className="text-white">
      <Gap y={20} />
      <Col className="justify-between items-center">
        <Col className="w-full justify-center items-center md:items-start md:flex-row md:justify-start">
          <Col className="rounded-sm justify-center bg-gray-darker">
            {webtoon?.thumbPath == null ? (
              <div className="w-[300px] h-[450px] rounded-md bg-gray" />
            ) : (
              <div className="w-[300px] h-[450px] overflow-hidden relative rounded-sm">
                <Image
                  src={
                    webtoon?.thumbPath
                      ? buildImgUrl(null, webtoon.thumbPath, { size: "md" })
                      : "/img/webtoon_default_image_small.svg"
                  }
                  alt={`${webtoon?.thumbPath}`}
                  style={{ objectFit: "cover" }}
                  fill
                />
              </div>
            )}
          </Col>

          <Gap x={15} />
          <Gap y={20} />

          <Col>
            <Col>
              <Row className="justify-between">
                <Text className="text-[24pt] text-white">
                  {locale === "ko"
                    ? webtoon?.title
                    : webtoon?.title_en ?? webtoon?.title}{" "}
                </Text>
              </Row>
              <Gap y="16px" />
              <Row>
                <Text className="text-[16pt] text-white">
                  {webtoon && locale === "ko"
                    ? extractAuthorName(webtoon) ?? "알 수 없음"
                    : extractAuthorNameEn(webtoon) ?? "Unknown"}
                </Text>
                <Gap x={4} />
                <Text className="text-[16pt] text-white">|</Text>
                <Gap x={4} />
                <Text className="text-[16pt] text-white">
                  {webtoon?.ageLimit ? webtoon.ageLimit : "ALL"}
                </Text>
              </Row>
              <Gap y="16px" />
              <Text className="text-[12pt] text-white">
                {locale === "ko"
                  ? webtoon?.description
                  : webtoon?.description_en ?? webtoon?.description}
              </Text>
              <Gap y="16px" />
            </Col>
          </Col>
        </Col>
      </Col>
      <Gap y={20} />
      <Col>
        <Row>
          <Text className="text-[18pt] text-white">{t("personalInfo")}</Text>
          <Gap x={3} />
          <IconExclamation className="fill-white" />
        </Row>
        <Gap y={10} />
        <Row>
          <Col className="h-[70px]">
            <Text className="text-white">{t("typeOfContent")}</Text>
            <Gap y={3} />
            <RadioGroup
              disabled
              className="flex flex-wrap"
              value={`${bidRound.isBrandNew}`}
            >
              <Row>
                <RadioGroupItem value="true" className="border-white" />
                <Label>{t("latestContent")}</Label>
                <Gap x={2} />
                <RadioGroupItem value="false" className="border-white" />
                <Label>{t("earliestContent")}</Label>
              </Row>
            </RadioGroup>
          </Col>
          <Gap x={20} />
          <Col className="h-[70px]">
            <Text className="text-white">{t("serviceOnOtherPlatforms")}</Text>
            <Gap y={3} />
            <RadioGroup
              disabled
              className="flex flex-wrap"
              value={bidRound.originality}
            >
              <Row>
                <RadioGroupItem value="original" className="border-white" />
                <Label>{t("yes")}</Label>
                <Gap x={2} />
                <RadioGroupItem value="notOriginal" className="border-white" />
                <Label>{t("no")}</Label>
              </Row>
            </RadioGroup>
          </Col>
          <Gap x={20} />
          <Col className="h-[70px]">
            <Text className="text-white">{t("serviceEpisodeInformation")}</Text>
            <Gap y={3} />
            <Row>
              <Input
                disabled
                value={bidRound.numEpisode ?? 0}
                className="bg-white w-[30px] p-0 text-center text-black"
              />
              <Gap x={2} />
              <Text className="text-white">{t("completedEpisodes")}</Text>
            </Row>
          </Col>
        </Row>
        <Gap y={10} />
        {bidRound && bidRound.contractRange.data.length > 0 ? (
          <Row className="justify-between items-start">
            {bidRound.contractRange.data.filter(
              (item) => item.businessField === "webtoon"
            ).length > 0 ? (
              <Row className="w-[48%]">
                <Col className="w-full">
                  <Row className="justify-between">
                    <Text className="text-white text-[14pt] font-bold">
                      {tcontractRangeData("webtoonServiceRegion")}
                    </Text>
                    <Row>
                      <RadioGroup disabled value={"1"}>
                        <Row>
                          <RadioGroupItem value="1" className="border-mint" />
                          <Gap x={1} />
                          <Label>{tcontractRangeData("exclusive")}</Label>
                          <Gap x={5} />
                          <RadioGroupItem value="2" className="border-mint" />
                          <Gap x={1} />
                          <Label>{tcontractRangeData("nonExclusive")}</Label>
                        </Row>
                      </RadioGroup>
                    </Row>
                  </Row>
                  <Gap y={5} />
                  <Table className="text-white">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white w-[33%] text-center border">
                          {tcontractRangeData("serviceCountry")}
                        </TableHead>
                        <TableHead className="text-white w-[33%] text-center border">
                          {tcontractRangeData("exclusiveOrNon")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bidRound.contractRange.data
                        .filter((item) => item.businessField === "webtoon")
                        .map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-center border">
                              {locale === "ko"
                                ? nationConverterToKr(data.country)
                                : nationConverter(data.country)}
                            </TableCell>
                            <TableCell className="text-center border">
                              <RadioGroup disabled>
                                <RadioGroupItem
                                  value="exclusive"
                                  className="border-mint m-auto"
                                  checked={data.contract === "exclusive"}
                                />
                              </RadioGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Col>
              </Row>
            ) : null}
            {bidRound.contractRange.data.filter(
              (item) => item.businessField !== "webtoon"
            ).length > 0 ? (
              <Row className="w-[48%]">
                <Col className="w-full">
                  <Row className="justify-between">
                    <Text className="text-white text-[14pt] font-bold">
                      {tcontractRangeData("secondaryCopyrightSalesStatus")}
                    </Text>
                    <Row>
                      <RadioGroup disabled value={"1"}>
                        <Row>
                          <RadioGroupItem value="1" className="border-mint" />
                          <Gap x={1} />
                          <Label>{tcontractRangeData("exclusive")}</Label>
                          <Gap x={5} />
                          <RadioGroupItem value="2" className="border-mint" />
                          <Gap x={1} />
                          <Label>{tcontractRangeData("nonExclusive")}</Label>
                        </Row>
                      </RadioGroup>
                    </Row>
                  </Row>
                  <Gap y={5} />
                  <Table className="text-white">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white w-[33%] text-center border">
                          {tcontractRangeData("secondaryCopyright")}
                        </TableHead>
                        <TableHead className="text-white w-[33%] text-center border">
                          {tcontractRangeData("serviceCountry")}
                        </TableHead>
                        <TableHead className="text-white w-[33%] text-center border">
                          {tcontractRangeData("exclusiveOrNon")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bidRound.contractRange.data
                        .filter((item) => item.businessField !== "webtoon")
                        .map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-center border">
                              {locale === "en"
                                ? businessFieldConverterToEn(data.businessField)
                                : businessFieldConverterToKr(
                                    data.businessField
                                  )}
                            </TableCell>
                            <TableCell className="text-center border">
                              {locale === "ko"
                                ? nationConverterToKr(data.country)
                                : nationConverter(data.country)}
                            </TableCell>
                            <TableCell className="text-center border">
                              <RadioGroup disabled>
                                <RadioGroupItem
                                  value="exclusive"
                                  className="border-mint m-auto"
                                  checked={data.contract === "exclusive"}
                                />
                              </RadioGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Col>
              </Row>
            ) : null}
          </Row>
        ) : null}
        <Gap y={10} />
        <hr className="border border-gray-dark" />
        <Gap y={20} />
      </Col>

      <BuyerBidRoundRequestForm bidRound={bidRound} />
      <Gap y={40} />
    </Container>
  );
}
