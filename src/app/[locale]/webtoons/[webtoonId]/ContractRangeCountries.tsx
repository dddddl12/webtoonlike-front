import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { Label } from "@/ui/shadcn/Label";
import { BidRoundT, ContractRange, ContractRangeCountrySchema } from "@/resources/bidRounds/bidRound.types";
import { getTranslations } from "next-intl/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/Table";
import React from "react";
import z from "zod";

export default async function ContractRangeCountries({ bidRound }: {
  bidRound: BidRoundT
}) {

  const t = await getTranslations("contractRangeData");
  const tContractRange = await getTranslations("contractRange");

  return <Col className="flex-1">
    <Row className="justify-between">
      <h2 className="text-lg font-bold">
        {t("webtoonServiceRegion")}
      </h2>
      <RadioGroup disabled value={"1"} className="flex">
        <RadioGroupItem value="1" className="border-mint mr-1"/>
        <Label>{t("exclusive")}</Label>
        <Gap x={5}/>
        <RadioGroupItem value="2" className="border-mint mr-1"/>
        <Label>{t("nonExclusive")}</Label>
      </RadioGroup>
    </Row>
    <Table className="text-white mt-5">
      <TableHeader>
        <TableRow>
          <TableHead className="text-white w-[50%] text-center text-base border">
            {t("serviceCountry")}
          </TableHead>
          <TableHead className="text-white w-[50%] text-center text-base border">
            {t("exclusiveOrNon")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ContractRangeCountrySchema.options
          .map((code, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center border">
                {tContractRange(`countries.${code}`)}
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
  countryCode: z.infer<typeof ContractRangeCountrySchema>,
  data: z.infer<typeof ContractRange>
}) {
  const target = data.find((item) => item.businessField === "webtoon" && item.country === countryCode);
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