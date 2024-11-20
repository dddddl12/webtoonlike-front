"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponse, ListResponseSchema } from "@/resources/globalTypes";
import { AdminSchema } from "@/resources/admins/admin.types";
import prisma from "@/utils/prisma";
import { UserSchema, UserTypeT } from "@/resources/users/user.types";
import { assertAdmin, getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";
import { BadRequestError } from "@/handlers/errors";

const AdminEntrySchema = AdminSchema.pick({
  id: true,
  isSuper: true,
  createdAt: true,
}).extend({
  user: UserSchema.pick({
    name: true,
    email: true,
    userType: true
  }),
  isDeletable: z.boolean()
});
export type AdminEntryT = z.infer<typeof AdminEntrySchema>;
export const listAdmins = action
  .metadata({ actionName: "listAdmins" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  // todo 정적 분석을 하지 않음
  .outputSchema(
    ListResponseSchema(AdminEntrySchema)
  )
  .action(
    async ({
      parsedInput: { page },
    }): Promise<ListResponse<AdminEntryT>> => {
      await assertAdmin();
      const { userId, metadata } = await getTokenInfo();
      const limit = 10;
      const [records, totalRecords] = await prisma.$transaction([
        prisma.admin.findMany({
          take: limit,
          skip: (page - 1) * limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                userType: true
              }
            }
          }
        }),
        prisma.admin.count()
      ]);
      return {
        items: records.map(record => ({
          id: record.id,
          isSuper: record.isSuper,
          createdAt: record.createdAt,
          user: {
            name: record.user.name,
            email: record.user.email,
            userType: record.user.userType as UserTypeT
          },
          isDeletable: (metadata.adminLevel >= AdminLevel.SuperAdmin
            && record.user.id !== userId)
        })),
        totalPages: Math.ceil(totalRecords / limit),
      };
    });

export const createAdmin = action
  .metadata({ actionName: "deleteAdmin" })
  .schema(z.object({
    targetUserId: z.number()
  }))
  .action(async ({
    parsedInput: { targetUserId },
  }) => {
    await assertAdmin({ needsSuperPermission: true });
    await prisma.admin.create({
      data: {
        user: {
          connect: {
            id: targetUserId
          }
        }
      }
    });
  });


export const deleteAdmin = action
  .metadata({ actionName: "deleteAdmin" })
  .bindArgsSchemas([
    z.number() // adminId
  ])
  .action(async ({
    bindArgsParsedInputs: [adminId],
  }) => {
    await assertAdmin({ needsSuperPermission: true });
    const { userId } = await getTokenInfo();
    await prisma.$transaction(async (tx) => {
      const { userId: targetUserId } = await tx.admin.delete({
        where: {
          id: adminId
        },
        select: {
          userId: true
        }
      });
      if (userId === targetUserId){
        throw new BadRequestError({
          title: "관리자 권한 삭제 불가",
          message: "자신의 권한은 삭제할 수 없습니다.",
          logError: true,
        });
      }
    });
  });
