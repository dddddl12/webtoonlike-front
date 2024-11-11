import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import { useTranslations } from "next-intl";
import { Col, Row } from "@/shadcn/ui/layouts";
import { BidRequestExtendedT, BidRequestT } from "@/resources/bidRequests/bidRequest.types";
import z from "zod";
import { Heading, Heading2 } from "@/shadcn/ui/texts";
import { getPublicBuyerInfoByUserId } from "@/resources/buyers/buyer.service";
import { useEffect, useState } from "react";
import { PublicBuyerInfoT } from "@/resources/buyers/buyer.types";
import Spinner from "@/components/Spinner";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";

export default function ViewOfferSection({ bidRequest }: {
  bidRequest: BidRequestExtendedT;
}) {
  const [buyer, setBuyer] = useState<PublicBuyerInfoT>();

  useEffect(() => {
    getPublicBuyerInfoByUserId(bidRequest.userId)
      .then(setBuyer);
  }, [bidRequest.userId]);

  if (!buyer) {
    return <Spinner />;
  }
  return <Col className="w-full my-10">
    <Offerer buyer={buyer} />
    <hr className="my-10" />
    <OfferDetails bidRequest={bidRequest} />
  </Col>;
}

function Offerer({ buyer }: {
  buyer: PublicBuyerInfoT;
}) {
  const tMakeAnOffer = useTranslations("makeAnOffer");

  return <Col>
    <Heading>{tMakeAnOffer("offerer")}</Heading>
    <Row className="gap-10">
      <Col>
        <Image
          src={buildImgUrl(buyer.company.thumbPath, {
            size: "sm",
            fallback: "user"
          })}
          alt="profile_image"
          style={{ objectFit: "cover" }}
          className="rounded-full"
          width={90}
          height={90}
        />
      </Col>
      <Col className="flex-1 gap-4">
        <Row className="text-2xl font-bold">{buyer.username}</Row>
        <Row className="text-[18px] font-semibold">{[
          buyer.company.name,
          buyer.company.dept,
          buyer.company.position,
        ].join(" / ")}</Row>
      </Col>
    </Row>

  </Col>;
}

function OfferDetails({ bidRequest }: {
  bidRequest: BidRequestExtendedT;
}) {
  const t = useTranslations("contractRangeDataForm");
  const tCountries = useTranslations("countries");
  const tContractType = useTranslations("contractType");
  const tMakeAnOffer = useTranslations("makeAnOffer");
  const tBusinessFields = useTranslations("businessFields");

  const { webtoonRights, derivativeRights } = mapContractRange(bidRequest.contractRange);
  return <Col>
    <Heading>{tMakeAnOffer("offerDetails")}</Heading>
    <Col className="gap-14">
      {/*웹툰 연재권*/}
      {webtoonRights.size > 0 && <div>
        <Heading2>{t("webtoonSerialRights")}</Heading2>
        <Table className="text-white mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-white w-[33%] text-center text-base border">
                {t("serviceRegion")}
              </TableHead>
              <TableHead className="text-white w-[33%] text-center text-base border">
                {t("exclusiveRights")}
              </TableHead>
              <TableHead className="text-white w-[33%] text-center text-base border">
                {t("contractCondition")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ContractRangeItemSchema.shape.country.options
              .map((code, index) => {
                const itemData = webtoonRights.get(code);
                if (!itemData) {
                  return null;
                }
                return <TableRow key={index}>
                  <TableCell className="text-center border">
                    {tCountries(code, { plural: "true" })}
                  </TableCell>
                  <TableCell className="text-center border">
                    {tContractType(itemData.contract)}
                  </TableCell>
                  <TableCell className="text-center border">
                    {itemData.message}
                  </TableCell>
                </TableRow>;
              }
              )}
          </TableBody>
        </Table>
      </div>}

      {/*2차 사업권*/}
      {derivativeRights.size > 0 && <div>
        <Heading2>{t("secondBusinessRight")}</Heading2>
        <Table className="text-white mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-white w-[33%] text-center text-base border">
                {t("businessRightClassification")}
              </TableHead>
              <TableHead className="text-white w-[33%] text-center text-base border">
                {t("countryOfDistribution")}
              </TableHead>
              <TableHead className="text-white w-[33%] text-center text-base border">
                {t("contractCondition")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ContractRangeItemSchema.shape.businessField.options
              .map((code, index) => {
                const itemData = derivativeRights.get(code);
                if (!itemData) {
                  return null;
                }
                return <TableRow key={index}>
                  <TableCell className="text-center border">
                    {tBusinessFields(code, { plural: "true" })}
                  </TableCell>
                  <TableCell className="text-center border">
                    {itemData.map(el => tCountries(el.country))
                      .join(", ")}
                  </TableCell>
                  <TableCell className="text-center border">
                    {itemData.map(el => el.message)
                      .join("\n")}
                  </TableCell>
                </TableRow>;
              }
              )}
          </TableBody>
        </Table>
      </div>}

      {/*  추가 메시지*/}
      <div>
        <Heading2>{tMakeAnOffer("toCreator")}</Heading2>
        <div className="min-h-[100px] rounded-sm bg-gray-darker p-2">
          {bidRequest.message || "추가 메시지가 없습니다."}
        </div>
        <p className="text-[10pt] text-gray-shade mt-3">
          {tMakeAnOffer("note")}
        </p>
      </div>
    </Col>
  </Col>;
}

function mapContractRange(contractRange: BidRequestT["contractRange"]) {
  const webtoonRights: Map<
    z.infer<typeof ContractRangeItemSchema.shape.country>, {
    contract: z.infer<typeof ContractRangeItemSchema.shape.contract>;
    message?: string;
  }> = new Map();
  const derivativeRights: Map<
    z.infer<typeof ContractRangeItemSchema.shape.businessField>, {
    country: z.infer<typeof ContractRangeItemSchema.shape.country>;
    message?: string;
  }[]> = new Map();
  // TODO 국가 한꺼번에 묶을 수 없음
  contractRange.forEach((item) => {
    if (item.businessField === "WEBTOONS") {
      webtoonRights.set(item.country, {
        contract: item.contract,
        message: item.message,
      });
    } else {
      const currentDerivativeRights = derivativeRights.get(item.businessField);
      if (currentDerivativeRights) {
        currentDerivativeRights.push({
          country: item.country,
          message: item.message,
        });
      } else {
        derivativeRights.set(item.businessField, [{
          country: item.country,
          message: item.message,
        }]);
      }
    }
  });
  return { webtoonRights, derivativeRights };
}