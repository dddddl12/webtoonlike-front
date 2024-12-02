import { useTranslations } from "next-intl";
import { Heading2, Heading3 } from "@/components/ui/common";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { ContractRangeItemSchema } from "@/resources/bidRounds/dtos/bidRound.dto";
import z from "zod";
import { OfferProposalT } from "@/resources/offers/dtos/offerProposal.dto";
import { clsx } from "clsx";

export default function OfferProposalDetails({ offerProposal, forInvoice }: {
  offerProposal: OfferProposalT;
  forInvoice?: boolean;
}) {
  const t = useTranslations("contractRangeDataForm");
  const tCountries = useTranslations("countries");
  const tContractType = useTranslations("contractType");
  const tOfferDetails = useTranslations("offerDetails");
  const tBusinessFields = useTranslations("businessFields");

  const { contractRange, message } = offerProposal;
  const { webtoonRights, derivativeRights } = mapContractRange(contractRange);
  return <div>
    <Heading2>{forInvoice
      ? tOfferDetails("agreedTerms")
      : tOfferDetails("offerProposalDetails")}</Heading2>
    {/*웹툰 연재권*/}
    {webtoonRights.size > 0 && <>
      <Heading3>{t("webtoonSerialRights")}</Heading3>
      <Table variant="outline">
        <TableHeader>
          <TableRow>
            <TableHead>
              {t("serviceRegion")}
            </TableHead>
            <TableHead>
              {t("exclusiveRights")}
            </TableHead>
            <TableHead>
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
                <TableCell>
                  {tCountries(code, { plural: "true" })}
                </TableCell>
                <TableCell>
                  {tContractType(itemData.contract)}
                </TableCell>
                <TableCell>
                  {itemData.message}
                </TableCell>
              </TableRow>;
            }
            )}
        </TableBody>
      </Table>
    </>}

    {/*2차 사업권*/}
    {derivativeRights.size > 0 && <>
      <Heading3>{t("secondBusinessRight")}</Heading3>
      <Table variant="outline">
        <TableHeader>
          <TableRow>
            <TableHead>
              {t("businessRightClassification")}
            </TableHead>
            <TableHead>
              {t("countryOfDistribution")}
            </TableHead>
            <TableHead>
              {t("contractCondition")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ContractRangeItemSchema.shape.businessField.options
            .map((code, index) => {
              const itemData = derivativeRights.get(code);
              if (!itemData){
                return null;
              }
              return itemData.map(item => {
                const { country, message } = item;
                return <TableRow key={`${index}__${country}`}>
                  <TableCell>
                    {tBusinessFields(code, { plural: "true" })}
                  </TableCell>
                  <TableCell>
                    {tCountries(country)}
                  </TableCell>
                  <TableCell>
                    {message}
                  </TableCell>
                </TableRow>;
              });
            })}
        </TableBody>
      </Table>
    </>}

    {/*  추가 메시지*/}
    <Heading3>{tOfferDetails("additionalMessage")}</Heading3>
    <div className={clsx("min-h-[100px] rounded-sm bg-muted text-sm p-2", {
      "text-muted-foreground": !message
    })}>
      {message || tOfferDetails("thereIsNoMessageWrittenByTheBuyer")}
    </div>
    <p className="text-sm text-muted-foreground mt-3">
      {tOfferDetails("note")}
    </p>
  </div>;
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