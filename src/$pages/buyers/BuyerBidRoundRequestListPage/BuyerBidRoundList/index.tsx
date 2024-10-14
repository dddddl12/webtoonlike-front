"use client";

import { useListData } from "@/hooks/ListData";
import * as BidRequestApi from "@/apis/bid_request";
import { useEffect, useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { ListView } from "@/ui/tools/ListView";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { convertTimeAbsolute } from "@/utils/time";
import {
  convertBidRequestStatus,
  convertBidRequestStatusEn,
} from "@/utils/bidRequestStatusConverter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/shadcn/Accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/Table";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { generateRandomString } from "@/utils/randomString";
import { useLocale, useTranslations } from "next-intl";
import * as BidRoundApi from "@/apis/bid_rounds";
import Spinner from "@/components/Spinner";
import { useRouter } from "@/i18n/routing";
import { getServerUserInfo } from "@/utils/auth/server";
import type { BidRoundT, ListBidRoundOptionT } from "@backend/types/BidRound";
import type { ListBidRequestOptionT } from "@backend/types/BidRequest";

const OFFER_TABLE_HEADER = [
  { ko: "No.", en: "No." },
  { ko: "일자", en: "Date" },
  { ko: "협의 내용", en: "Negotiation content" },
  { ko: "", en: "" },
];

export function BuyerBidRoundList() {
  const router = useRouter();
  const t = useTranslations("offerPage");
  const user = getServerUserInfo();
  const [filteredBidRounds, setFilteredBidRounds] = useState<BidRoundT[]>([]);
  const locale = useLocale();

  const { data: bidRounds$, actions: bidRoundsAct } = useListData({
    listFn: async (listOpt) => {
      return await BidRoundApi.list(listOpt);
    },
  });

  const bidRoundListOpt: ListBidRoundOptionT = {
    $webtoon: true,
    $user: true,
    $numData: true,
    $requests: true,
    // limit: 10,
  };

  const { data: bidRequest$, actions: bidRequesetAct } = useListData({
    listFn: async (listOpt) => {
      return await BidRequestApi.list(listOpt);
    },
  });

  const listOpt: ListBidRequestOptionT = {
    meId: user.id,
    userId: user.id,
    $webtoon: true,
    $round: true,
    $buyer: true,
    $creator: true,
    // limit: 10,
    mine: "only",
  };

  bidRoundsAct.load(bidRoundListOpt);
  bidRequesetAct.load(listOpt);

  function handleLoaderDetect(): void {
    bidRoundsAct.refill();
    bidRequesetAct.refill();
  }

  const { data: bidRounds } = bidRounds$;
  const { data: bidRequest } = bidRequest$;

  useEffect(() => {
    if (!bidRequest) return;
    const roundIds = new Set(bidRequest.map((cur) => cur.roundId));
    const filteredBidRounds = bidRounds.filter((bidRound) =>
      roundIds.has(bidRound.id)
    );
    setFilteredBidRounds(filteredBidRounds);
  }, [bidRequest, bidRounds]);

  return (
    <Col className="text-white">
      <Heading className="font-bold text-[26pt]">{t("offerStatus")}</Heading>
      <Gap y={10} />
      <Row className="justify-between w-full">
        <Row className="w-[30%] items-center justify-start">
          {t("titleOfSeries")}
        </Row>
        <Row className="w-[60%] justify-between">
          <Row className="w-full items-center justify-center">
            {t("registrationDate")}
          </Row>
          <Row className="w-full items-center justify-center">
            {t("viewNegotiationHistory")}
          </Row>
          <Row className="w-full items-center justify-center">
            {t("situation")}
          </Row>
        </Row>
      </Row>
      <Gap y={4} />
      {filteredBidRounds.length === 0 ? (
        <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
          <Text className="text-white">{t("ifNoOfferDesc")}</Text>
        </Row>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          <ListView
            data={filteredBidRounds}
            onLoaderDetect={handleLoaderDetect}
            renderItem={(bidRound, idx) => {
              return (
                <AccordionItem
                  key={generateRandomString()}
                  value={`item-${idx}`}
                  className="border-b-0"
                >
                  <AccordionTrigger className="bg-gray-darker justify-between p-3 rounded-md">
                    <Row className="w-[30%]">
                      <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
                        <Image
                          src={
                            bidRound.webtoon?.thumbPath
                              ? buildImgUrl(null, bidRound.webtoon.thumbPath, {
                                size: "xxs",
                              })
                              : "/img/webtoon_default_image_small.svg"
                          }
                          alt={`${bidRound.webtoon?.thumbPath}`}
                          style={{ objectFit: "cover" }}
                          fill
                        />
                      </div>
                      <Gap x={4} />
                      <div
                        className="text-mint underline cursor-pointer"
                        onClick={() => {
                          router.push(`/webtoons/${bidRound.webtoon?.id}`);
                        }}
                      >
                        {locale === "ko"
                          ? bidRound.webtoon?.title
                          : bidRound.webtoon?.title_en ??
                            bidRound.webtoon?.title}
                      </div>
                    </Row>
                    <Row className="w-[60%] justify-between">
                      <Row className="w-full items-center justify-center">
                        {convertTimeAbsolute(bidRound.createdAt)}
                      </Row>
                      <Row className="w-full items-center justify-center">
                        <div
                          className="text-mint underline cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/buyer/bid-round-requests/${
                                bidRound.requests && bidRound.requests[0].id
                              }/negotiation-detail`
                            );
                          }}
                        >
                          {t("viewNegotiationHistory")}
                        </div>
                      </Row>
                      <Row className="w-full items-center justify-center">
                        {locale === "ko"
                          ? convertBidRequestStatus(bidRound.status)
                          : convertBidRequestStatusEn(bidRound.status)}
                      </Row>
                      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    </Row>
                  </AccordionTrigger>
                  <AccordionContent className="bg-gray-dark rounded-md px-6">
                    <Gap y={4} />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {OFFER_TABLE_HEADER.map((item) => (
                            <TableHead
                              key={generateRandomString()}
                              className="text-center"
                            >
                              {locale === "en" ? item.en : item.ko}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bidRound.requests && bidRound.requests.length > 0 ? (
                          bidRound.requests
                            .filter((item) => item.userId === user.id)
                            .map((item, idx) => (
                              <TableRow key={generateRandomString()}>
                                <TableCell className="text-center">
                                  {idx + 1}
                                </TableCell>
                                <TableCell className="text-center">
                                  {convertTimeAbsolute(item.createdAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.message ? item.message : "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div
                                    className="text-mint underline cursor-pointer"
                                    onClick={() => {
                                      router.push(
                                        `/buyer/bid-round-requests/${item.id}/negotiation-detail`
                                      );
                                    }}
                                  >
                                    {locale === "ko" ? "확인하기" : "Check"}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={OFFER_TABLE_HEADER.length}
                              className="text-center"
                            >
                              <Gap y={4} />
                              협의 내역이 존재하지 않습니다.
                              <Gap y={4} />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <Gap y={4} />
                  </AccordionContent>
                  <Gap y={4} />
                </AccordionItem>
              );
            }}
            renderAppend={() => {
              if (bidRequest$.appendingStatus == "loading") {
                return <Spinner />;
              }
              return null;
            }}
          />
        </Accordion>
      )}
    </Col>
  );
}
