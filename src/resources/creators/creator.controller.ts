"use server";

import { AdminPageCreatorSchema, PublicCreatorSchema } from "@/resources/creators/creator.dto";
import { ListResponseSchema } from "@/resources/globalTypes";
import z from "zod";
import { action } from "@/handlers/safeAction";
import creatorService from "@/resources/creators/creator.service";

export const getCreatorByUserId = action
  .metadata({ actionName: "getCreatorByUserId" })
  .bindArgsSchemas([
    z.number() // userId
  ])
  .outputSchema(PublicCreatorSchema)
  .action(async ({
    bindArgsParsedInputs: [userId],
  }) => {
    return creatorService.getByUserId(userId);
  });

export const listCreators = action
  .metadata({ actionName: "listCreators" })
  .schema(z.object({
    page: z.number()
  }))
  .outputSchema(ListResponseSchema(AdminPageCreatorSchema))
  .action(async ({ parsedInput }) => {
    return creatorService.list(parsedInput);
  });

const ChangeExposedSchema = z.object({
  isExposed: z.boolean()
});
export type ChangeExposedT = z.infer<typeof ChangeExposedSchema>;
export const changeExposed = action
  .metadata({ actionName: "changeExposed" })
  .bindArgsSchemas([
    z.number(), // creatorId
  ])
  .schema(ChangeExposedSchema)
  .outputSchema(ChangeExposedSchema)
  .action(async ({
    bindArgsParsedInputs: [creatorId],
    parsedInput,
  }) => {
    return creatorService.changeExposed(creatorId, parsedInput);
  });
