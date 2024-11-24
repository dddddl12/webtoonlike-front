"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import buyerService from "@/resources/buyers/buyer.service";
import { PublicBuyerInfoSchema } from "@/resources/buyers/buyer.dto";

export const getPublicBuyerInfoByUserId = action
  .metadata({
    actionName: "getPublicBuyerInfoByUserId"
  })
  .bindArgsSchemas([
    z.number() // userId
  ])
  .outputSchema(PublicBuyerInfoSchema)
  .action(
    async ({
      bindArgsParsedInputs: [userId]
    }) => {
      return buyerService.getPublicByUserId(userId);
    });
