import { BidRequestT } from "@/resources/bidRequests/bidRequest.types";
import { useTranslations } from "next-intl";
import { Col } from "@/shadcn/ui/layouts";
import { Heading, Heading2 } from "@/shadcn/ui/texts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import z from "zod";

export default function OfferDetails({ bidRequest }: {
  bidRequest: BidRequestT;
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
              <TableHead className="text-white w-[33%] text-center text-base border border-white">
                {t("serviceRegion")}
              </TableHead>
              <TableHead className="text-white w-[33%] text-center text-base border border-white">
                {t("exclusiveRights")}
              </TableHead>
              <TableHead className="text-white w-[33%] text-center text-base border border-white">
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
                  <TableCell className="text-center border border-white">
                    {tCountries(code, { plural: "true" })}
                  </TableCell>
                  <TableCell className="text-center border border-white">
                    {tContractType(itemData.contract)}
                  </TableCell>
                  <TableCell className="text-center border border-white">
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