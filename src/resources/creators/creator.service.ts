"use server";

import prisma from "@/utils/prisma";
import { CreatorSchema } from "@/resources/creators/creator.types";
import { UserSchema } from "@/resources/users/user.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import { assertAdmin } from "@/resources/tokens/token.service";
import z from "zod";
import { action } from "@/handlers/safeAction";

const PublicCreatorSchema = z.object({
  name: z.string(),
  name_en: z.string().optional(),
  thumbPath: z.string().optional(),
});
export const getCreator = action
  .metadata({ actionName: "getCreator" })
  .bindArgsSchemas([
    z.number() // creatorUid
  ])
  .outputSchema(PublicCreatorSchema)
  .action(async ({
    bindArgsParsedInputs: [creatorUid],
  }) => {
    const record = await prisma.creator.findUniqueOrThrow({
      where: {
        userId: creatorUid,
        isExposed: true,
      },
      select: {
        name: true,
        name_en: true,
        thumbPath: true,
      }
    });
    return {
      name: record.name,
      name_en: record.name_en ?? undefined,
      thumbPath: record.thumbPath ?? undefined,
    };
  });

const AdminPageCreatorSchema = CreatorSchema.pick({
  id: true,
  name: true,
  isExposed: true,
}).extend({
  user: UserSchema.pick({
    name: true,
    createdAt: true
  })
});
export type AdminPageCreatorT = z.infer<typeof AdminPageCreatorSchema>;
export const listCreators = action
  .metadata({ actionName: "listCreators" })
  .schema(z.object({
    page: z.number()
  }))
  .outputSchema(ListResponseSchema(AdminPageCreatorSchema))
  .action(async ({
    parsedInput: { page },
  }) => {

    await assertAdmin();
    const limit = 5;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.creator.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          name: true,
          isExposed: true,
          user: {
            select: {
              name: true,
              createdAt: true
            }
          }
        }
      }),
      prisma.creator.count()
    ]);
    const items: AdminPageCreatorT[] = records.map(r => {
      return {
        id: r.id,
        name: r.name,
        isExposed: r.isExposed,
        user: {
          name: r.user.name,
          createdAt: r.user.createdAt
        }
      };
    });
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  });

export const changeExposed = action
  .metadata({ actionName: "changeExposed" })
  .bindArgsSchemas([
    z.number(), // creatorId
  ])
  .schema(z.object({
    isExposed: z.boolean()
  }))
  .outputSchema(z.object({
    isExposed: z.boolean()
  }))
  .action(async ({
    parsedInput: { isExposed },
    bindArgsParsedInputs: [creatorId],
  }) => {
    await assertAdmin();
    // throw new NotAuthorized("Not implemented");
    const { isExposed: newIsExposed } = await prisma.creator.update({
      select: {
        isExposed: true
      },
      where: {
        id: creatorId
      },
      data: {
        isExposed
      }
    });
    return { isExposed: newIsExposed };
  });
