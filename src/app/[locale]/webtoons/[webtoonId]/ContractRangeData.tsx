"use client";

import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { Label } from "@/ui/shadcn/Label";
import { RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/Table";
import { Text } from "@/ui/texts";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Fragment } from "react";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { useUserMetadata } from "@/hooks/userMetadata";

const nationMap = {
  "all": "전체",
  "ko": "대한민국",
  "en": "미국",
  "zhCN": "중국",
  "zhTW": "대만",
  "de": "독일",
  "id": "인도네시아",
  "ja": "일본",
  "fr": "프랑스",
  "es": "스페인",
  "vi": "베트남",
  "ms": "말레이시아",
  "th": "태국"
};
const typeMap = {
  "all": "전체",
  "webtoon": "웹툰",
  "movie": "영화",
  "drama": "드라마",
  "webDrama": "웹드라마",
  "ads": "광고",
  "musical": "뮤지컬",
  "game": "게임",
  "book": "도서",
  "product": "상품"
};


export function ContractRangeData({ webtoon }: {
  webtoon: WebtoonT;
}) {
  const locale = useLocale();
  const router = useRouter();
  const { user } = useUserMetadata();

  const t = useTranslations("contractRangeData");
  const Tbusiness = useTranslations("businessFieldENG");

  if(!webtoon.bidRounds?.length) {
    return <>
      등록된 판매 정보가 없습니다.
    </>;
  }

  return (
    <Fragment>
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
          <Row>
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
            </Col>
            <Gap x={10} />
            <Col className="p-5">
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
            </Col>
            <Gap x={10} />
            <Col className="p-5">
              <Text className="text-white">{t("serviceEpisodeInformation")}</Text>
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
            </Col>
          </Row>
          <Gap y={2} />
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

        <Row className="justify-between items-start">
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
                  {Object.entries(nationMap)
                    .map(([code, name], index) => {
                      return <TableRow key={index}>
                        <TableCell className="text-center border">
                          {name}
                        </TableCell>
                        <TableCell className="text-center border">
                          <WhetherExclusive countryCode={code} data={webtoon.bidRounds?.[0].contractRange.data || []} />
                        </TableCell>
                      </TableRow>;
                    }
                    )}
                </TableBody>
              </Table>
            </Col>
          </Row>
          <Row className="w-[48%]">
            <Col className="w-full">
              <Row className="justify-between">
                <Text className="text-white text-[14pt] font-bold">
                  {t("secondaryCopyrightSalesStatus")}
                </Text>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(typeMap)
                    .map(([code, name], index) => {
                      return <TableRow key={index}>
                        <TableCell className="text-center border">
                          {name}
                        </TableCell>
                        <TableCell className="text-center border">
                          {webtoon.bidRounds?.[0].contractRange.data
                            .filter(item => item.businessField === code)
                            .map(item => nationMap[item.country])
                            .join(", ")
                          }
                        </TableCell>
                      </TableRow>;
                    })}
                </TableBody>
              </Table>
            </Col>
          </Row>
        </Row>

      </Col>
    </Fragment>
  );
}

function WhetherExclusive({ data, countryCode }: {
  countryCode: any, data: any
}) {
  const target = data?.find((item: any) => item.businessField === "webtoon" && item.country === countryCode);
  if (!target) {
    return <></>;
  }
  return <RadioGroup disabled>
    <RadioGroupItem
      value="exclusive"
      className="border-mint m-auto"
      checked={target.contract === "exclusive"}
    />
  </RadioGroup>;

}