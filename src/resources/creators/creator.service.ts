"use server";

import prisma from "@/utils/prisma";
import { CreatorSchema, PublicCreatorT } from "@/resources/creators/creator.types";
import { UserSchema } from "@/resources/users/user.types";
import { ListResponse } from "@/resources/globalTypes";
import { assertAdmin } from "@/resources/tokens/token.service";
import z from "zod";

const CreatorExtendedSchema = CreatorSchema
  .extend({
    user: UserSchema
  });

export async function getCreator(creatorUid: number): Promise<PublicCreatorT> {
  const record = await prisma.creator.findUniqueOrThrow({
    where: {
      userId: creatorUid,
      // isExposed: true, //TODO
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
}

const AdminPageCreatorSchema = CreatorExtendedSchema.pick({
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
export async function listCreators({ page }: {
  page: number;
}): Promise<ListResponse<AdminPageCreatorT>> {
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
}

export async function changeExposed(creatorId: number, isExposed: boolean) {
  await assertAdmin();
  await prisma.creator.update({
    where: {
      id: creatorId
    },
    data: {
      isExposed
    }
  });
}