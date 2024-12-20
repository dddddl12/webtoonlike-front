import { Col, Row } from "@/components/ui/common";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { BidRoundT, ContractRange, ContractRangeItemSchema } from "@/resources/bidRounds/dtos/bidRound.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import React from "react";
import z from "zod";
import { useTranslations } from "next-intl";

export default function ContractRangeCountries({ bidRound }: {
  bidRound: BidRoundT;
}) {

  const t = useTranslations("bidRoundDetails");
  const tCountries = useTranslations("countries");
  const tContractType = useTranslations("contractType");

  return <Col className="flex-1">
    <Row className="justify-between">
      <h2 className="text-lg font-bold">
        {t("webtoonServiceRegion")}
      </h2>
      <RadioGroup disabled value="EXCLUSIVE" className="flex gap-5">
        {ContractRangeItemSchema.shape.contract
          .options.map((value) => {
            return <Row key={value} className="flex gap-2">
              <RadioGroupItem
                className="border-mint"
                value={value}
              />
              <Label variant="selectItem">
                {tContractType(value)}
              </Label>
            </Row>;
          })}
      </RadioGroup>
    </Row>
    <Table className="mt-5">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%] text-center border">
            {t("serviceCountry")}
          </TableHead>
          <TableHead className="w-[50%] text-center border">
            {t("exclusiveOrNon")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ContractRangeItemSchema.shape.country.options
          .map((code, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center border">
                {tCountries(code, { plural: "true" })}
              </TableCell>
              <TableCell className="text-center border">
                <WhetherExclusive
                  countryCode={code}
                  data={bidRound.contractRange}/>
              </TableCell>
            </TableRow>;
          }
          )}
      </TableBody>
    </Table>
  </Col>;
}

// todo 데이터 형태 재검토
function WhetherExclusive({ data, countryCode }: {
  countryCode: z.infer<typeof ContractRangeItemSchema.shape.country>;
  data: z.infer<typeof ContractRange>;
}) {
  const target = data.find((item) => item.businessField === "WEBTOONS" && item.country === countryCode);
  if (!target) {
    return <></>;
  }
  return <RadioGroup disabled>
    <RadioGroupItem
      value="exclusive"
      className="border-mint m-auto"
      checked={target.contract === "EXCLUSIVE"}
    />
  </RadioGroup>;

}