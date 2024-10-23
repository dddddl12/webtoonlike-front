"use client";

import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { Label } from "@/ui/shadcn/Label";
import { RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/Table";
import { Text } from "@/ui/texts";
import { nationConverter, nationConverterToKr } from "@/utils/nationConverter";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Fragment } from "react";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { useUserInfo } from "@/utils/auth/client";

export function ContractRangeData({ webtoon }: {
  webtoon: WebtoonT;
}) {
  const locale = useLocale();
  const router = useRouter();
  const { user } = useUserInfo();

  const t = useTranslations("contractRangeData");
  const Tbusiness = useTranslations("businessFieldENG");

  return (
    <Fragment>
      <Gap y={10} />
      <hr className="border-gray-shade" />
      <Gap y={10} />
      <Row>
        <p className="text-2xl font-bold">{t("detailedInformation")}</p>
        {user?.id === webtoon.authorId && (
          <>
            <Gap x={4} />
            <Button
              className="bg-mint"
              onClick={() => {
                router.push(`/market/bid-rounds/${webtoon.id}/update`);
              }}
            >
              {locale === "ko" ? "수정" : "Edit"}
            </Button>
          </>
        )}
      </Row>
      <Col className="p-5">
        <Row>
          <Text className="text-white text-[14pt] font-bold">
            {t("seriesInformation")}
          </Text>
          <Gap x={3} />
          <IconExclamation className="fill-white" />
        </Row>
        <Col className="p-5">
          <Text className="text-white">{t("seriesType")}</Text>
          <Gap y={2} />
          <RadioGroup
            disabled
            value={webtoon.bidRounds && `${webtoon.bidRounds[0]?.isBrandNew}`}
          >
            <Row>
              <RadioGroupItem value="true" className="border-white" />
              <Label>{t("latestContent")}</Label>
              <Gap x={2} />
              <RadioGroupItem value="false" className="border-white" />
              <Label>{t("earliestContent")}</Label>
            </Row>
          </RadioGroup>
          <Gap y={10} />
          <Text className="text-white">{t("serviceOnOtherPlatforms")}</Text>
          <Gap y={2} />
          <RadioGroup
            disabled
            value={webtoon.bidRounds && `${webtoon.bidRounds[0]?.isOriginal}`}
          >
            <Row>
              <RadioGroupItem value="original" className="border-white" />
              <Label>{t("yes")}</Label>
              <Gap x={2} />
              <RadioGroupItem value="notOriginal" className="border-white" />
              <Label>{t("no")}</Label>
            </Row>
          </RadioGroup>
          <Gap y={10} />
          <Text className="text-white">{t("serviceEpisodeInformation")}</Text>
          <Gap y={2} />
          <Row>
            {webtoon.bidRounds &&
            webtoon.bidRounds[0] &&
            webtoon.bidRounds[0].nowEpisode &&
            webtoon.bidRounds[0].nowEpisode > 0 ? (
                <>
                  <Input
                    placeholder="_"
                    defaultValue={
                      webtoon.bidRounds && webtoon.bidRounds[0]?.nowEpisode
                        ? webtoon.bidRounds[0]?.nowEpisode
                        : 0
                    }
                    className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
                  />
                  <Gap x={2} />
                  {t("completedEpisodes")}
                  <Gap x={2} />
                </>
              ) : null}

            <Gap x={2} />
            <Input
              placeholder="_"
              defaultValue={
                webtoon.bidRounds && webtoon.bidRounds[0]?.numEpisode
                  ? webtoon.bidRounds[0]?.numEpisode
                  : 0
              }
              className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
            />
            <Gap x={2} />
            {t("episodesCompleted")}
          </Row>

          {webtoon.bidRounds &&
            webtoon.bidRounds[0] &&
            webtoon.bidRounds[0].monthlyNumEpisode &&
            webtoon.bidRounds[0].monthlyNumEpisode > 0 ? (
              <>
                <Gap y={4} />
                <Text className="text-white">
                  {t("monthlyProductionAvailableRounds")}
                </Text>
                <Gap y={2} />
                <Row>
                  <Input
                    placeholder="_"
                    defaultValue={
                      webtoon.bidRounds && webtoon.bidRounds[0]?.monthlyNumEpisode
                        ? webtoon.bidRounds[0]?.monthlyNumEpisode
                        : 0
                    }
                    className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
                  />
                  <Gap x={2} />
                  {t("episodesPossible")}
                </Row>
              </>
            ) : null}

          <Gap y={2} />
        </Col>

        {webtoon.bidRounds &&
        webtoon.bidRounds.length > 0 &&
        webtoon.bidRounds[0].contractRange.data.length > 0 ? (
            <Row className="justify-between items-start">
              {webtoon.bidRounds[0].contractRange.data.filter(
                (item) => item.businessField === "webtoon"
              ).length > 0 ? (
                  <Row className="w-[48%]">
                    <Col className="w-full">
                      <Row className="justify-between">
                        <Text className="text-white text-[14pt] font-bold">
                          {t("webtoonServiceRegion")}
                        </Text>
                        <Row>
                          <RadioGroup disabled value={"1"}>
                            <Row>
                              <RadioGroupItem value="1" className="border-mint" />
                              <Gap x={1} />
                              <Label>{t("exclusive")}</Label>
                              <Gap x={5} />
                              <RadioGroupItem value="2" className="border-mint" />
                              <Gap x={1} />
                              <Label>{t("nonExclusive")}</Label>
                            </Row>
                          </RadioGroup>
                        </Row>
                      </Row>
                      <Gap y={5} />
                      <Table className="text-white">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-white w-[33%] text-center border">
                              {t("serviceCountry")}
                            </TableHead>
                            <TableHead className="text-white w-[33%] text-center border">
                              {t("exclusiveOrNon")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {webtoon.bidRounds[0].contractRange.data
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
              {webtoon.bidRounds[0].contractRange.data.filter(
                (item) => item.businessField !== "webtoon"
              ).length > 0 ? (
                  <Row className="w-[48%]">
                    <Col className="w-full">
                      <Row className="justify-between">
                        <Text className="text-white text-[14pt] font-bold">
                          {t("secondaryCopyrightSalesStatus")}
                        </Text>
                        <Row>
                          <RadioGroup disabled value={"1"}>
                            <Row>
                              <RadioGroupItem value="1" className="border-mint" />
                              <Gap x={1} />
                              <Label>{t("exclusive")}</Label>
                              <Gap x={5} />
                              <RadioGroupItem value="2" className="border-mint" />
                              <Gap x={1} />
                              <Label>{t("nonExclusive")}</Label>
                            </Row>
                          </RadioGroup>
                        </Row>
                      </Row>
                      <Gap y={5} />
                      <Table className="text-white">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-white w-[33%] text-center border">
                              {t("secondaryCopyright")}
                            </TableHead>
                            <TableHead className="text-white w-[33%] text-center border">
                              {t("serviceCountry")}
                            </TableHead>
                            <TableHead className="text-white w-[33%] text-center border">
                              {t("exclusiveOrNon")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {webtoon.bidRounds[0].contractRange.data
                            .filter((item) => item.businessField !== "webtoon")
                            .map((data, index) => (
                              <TableRow key={index}>
                                <TableCell className="text-center border">
                                  {Tbusiness(data.businessField)}
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
      </Col>
    </Fragment>
  );
}
