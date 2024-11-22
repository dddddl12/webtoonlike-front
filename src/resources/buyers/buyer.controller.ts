"use server";

import { BuyerCompanySchema, PublicBuyerInfoT } from "@/resources/buyers/buyer.types";
import prisma from "@/utils/prisma";

export const getPublicBuyerInfoByUserId = async (userId: number): Promise<PublicBuyerInfoT> => {
  const record = await prisma.buyer.findUniqueOrThrow({
    where: {
      userId
    },
    select: {
      company: true,
      user: {
        select: {
          name: true
        }
      }
    }
  });
  const company = BuyerCompanySchema.parse(record.company);
  return {
    username: record.user.name,
    company: {
      name: company.name,
      thumbPath: company.thumbPath,
      dept: company.dept,
      position: company.position,
    }
  };
};