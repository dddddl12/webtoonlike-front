"use client";

import { Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { convertTimeAbsolute } from "@/utils/time";
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
import { Link } from "@/i18n/routing";
import { BidRequestT } from "@/resources/bidRequests/bidRequest.types";

const OFFER_TABLE_HEADER = [
  { ko: "No.", en: "No." },
  { ko: "일자", en: "Date" },
  { ko: "협의 내용", en: "Negotiation content" },
  { ko: "", en: "" },
];

export function BuyerBidRequestList({
  bidRequests
}: {
  bidRequests: BidRequestT[]
}) {
  const t = useTranslations("offerPage");
  const TbidRequestStatus = useTranslations("bidRequestStatus");
  const locale = useLocale();

  // const [filteredBidRounds, setFilteredBidRounds] = useState<BidRoundT[]>([]);
  // useEffect(() => {
  //   if (!bidRequest) return;
  //   const roundIds = new Set(bidRequest.map((cur) => cur.roundId));
  //   const filteredBidRounds = bidRounds.filter((bidRound) =>
  //     roundIds.has(bidRound.id)
  //   );
  //   setFilteredBidRounds(filteredBidRounds);
  // }, [bidRequest, bidRounds]);

  if(!bidRequests.length) {
    return <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">{t("ifNoOfferDesc")}</Text>
    </Row>;
  }
  return <Accordion type="single" collapsible className="w-full">
    {bidRequests.map((bidRound, idx) => {
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
              <Link
                className="text-mint underline cursor-pointer"
                href={`/webtoons/${bidRound.webtoon?.id}`}
              >
                {locale === "ko"
                  ? bidRound.webtoon?.title
                  : bidRound.webtoon?.title_en ??
                            bidRound.webtoon?.title}
              </Link>
            </Row>
            <Row className="w-[60%] justify-between">
              <Row className="w-full items-center justify-center">
                {convertTimeAbsolute(bidRound.createdAt)}
              </Row>
              <Row className="w-full items-center justify-center">
                <Link
                  className="text-mint underline cursor-pointer"
                  href={`/buyer/bid-round-requests/${
                    bidRound.requests && bidRound.requests[0].id
                  }/negotiation-detail`}
                >
                  {t("viewNegotiationHistory")}
                </Link>
              </Row>
              <Row className="w-full items-center justify-center">
                {TbidRequestStatus(bidRound.status)}
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
                    .filter((item) => item.userId === bidRound.userId)
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
                          <Link
                            className="text-mint underline cursor-pointer"
                            href={`/buyer/bid-round-requests/${item.id}/negotiation-detail`}
                          >
                            {locale === "ko" ? "확인하기" : "Check"}
                          </Link>
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
    })
    }
  </Accordion>;
}
