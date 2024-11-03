import { BidRoundT, ContractRangeBusinessFieldSchema } from "@/resources/bidRounds/bidRound.types";
import { Col } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/Table";
import React from "react";
import { getTranslations } from "next-intl/server";

export default async function ContractRangeDerivative({ bidRound }: {
  bidRound: BidRoundT
}) {
  const t = await getTranslations("contractRangeData");
  const tContractRange = await getTranslations("contractRange");

  return <Col className="flex-1">
    <h2 className="text-lg font-bold">
      {t("secondaryCopyrightSalesStatus")}
    </h2>
    <Table className="text-white mt-5">
      <TableHeader>
        <TableRow>
          <TableHead className="text-white w-[50%] text-center text-base border">
            {t("secondaryCopyright")}
          </TableHead>
          <TableHead className="text-white w-[50%] text-center text-base border">
            {t("serviceCountry")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ContractRangeBusinessFieldSchema.options
          .map((code, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center border">
                {tContractRange(`derivative.${code}`)}
              </TableCell>
              <TableCell className="text-center border">
                {bidRound.contractRange
                  .filter(item => item.businessField === code)
                  .map(item =>
                    tContractRange(`countries.${item.country}`))
                  .join(", ")
                }
              </TableCell>
            </TableRow>;
          })}
      </TableBody>
    </Table>
  </Col>;
}