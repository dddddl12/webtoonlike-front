import { useTranslations } from "next-intl";
import { Col } from "@/components/ui/common";
import { Heading1, Heading2 } from "@/components/ui/common";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { ContractRangeItemSchema } from "@/resources/bidRounds/dtos/bidRound.dto";
import z from "zod";
import { OfferProposalT } from "@/resources/offers/dtos/offerProposal.dto";

export default function OfferProposalDetails({ offerProposal }: {
  offerProposal: OfferProposalT;
}) {
  const t = useTranslations("contractRangeDataForm");
  const tCountries = useTranslations("countries");
  const tContractType = useTranslations("contractType");
  const tMakeAnOffer = useTranslations("offerDetails");
  const tBusinessFields = useTranslations("businessFields");

  const { contractRange, message } = offerProposal;
  const { webtoonRights, derivativeRights } = mapContractRange(contractRange);
  return <Col>
    <Heading1>{tMakeAnOffer("offerDetails")}</Heading1>
    <Col className="gap-14">
      {/*웹툰 연재권*/}
      {webtoonRights.size > 0 && <div>
        <Heading2>{t("webtoonSerialRights")}</Heading2>
        <Table className="mt-5 [&_td]:border [&_th]:border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[33%] text-center text-base border border-white">
                {t("serviceRegion")}
              </TableHead>
              <TableHead className="w-[33%] text-center text-base border border-white">
                {t("exclusiveRights")}
              </TableHead>
              <TableHead className="w-[33%] text-center text-base border border-white">
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
      {/*todo variant 도입*/}
      {derivativeRights.size > 0 && <div>
        <Heading2>{t("secondBusinessRight")}</Heading2>
        <Table className="mt-5 [&_td]:border [&_th]:border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[33%] text-center">
                {t("businessRightClassification")}
              </TableHead>
              <TableHead className="w-[33%] text-center">
                {t("countryOfDistribution")}
              </TableHead>
              <TableHead className="w-[33%] text-center">
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
                  <TableCell className="text-center">
                    {tBusinessFields(code, { plural: "true" })}
                  </TableCell>
                  <TableCell className="text-center">
                    {itemData.map(el => tCountries(el.country))
                      .join(", ")}
                  </TableCell>
                  <TableCell className="text-center">
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
          {message || tMakeAnOffer("thereIsNoMessageWrittenByTheBuyer")}
        </div>
        <p className="text-[10pt] text-gray-shade mt-3">
          {tMakeAnOffer("note")}
        </p>
      </div>
    </Col>
  </Col>;
}

function mapContractRange(contractRange: OfferProposalT["contractRange"]) {
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