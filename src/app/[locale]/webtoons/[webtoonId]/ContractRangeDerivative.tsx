import { BidRoundT, ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import { Col } from "@/components/ui/layouts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/shadcn/Table";
import React from "react";
import { getTranslations } from "next-intl/server";

export default async function ContractRangeDerivative({ bidRound }: {
  bidRound: BidRoundT
}) {
  const t = await getTranslations("contractRangeData");
  const tCountries = await getTranslations("countries");
  const tBusinessFields = await getTranslations("businessFields");

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
        {ContractRangeItemSchema.shape.businessField.exclude(["WEBTOONS"]).options
          .map((code, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center border">
                {tBusinessFields(code, { plural: true })}
              </TableCell>
              <TableCell className="text-center border">
                {bidRound.contractRange
                  .filter(item => item.businessField === code)
                  .map(item =>
                    tCountries(item.country, { plural: true }))
                  .join(", ")
                }
              </TableCell>
            </TableRow>;
          })}
      </TableBody>
    </Table>
  </Col>;
}