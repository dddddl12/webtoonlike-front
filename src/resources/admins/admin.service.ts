import "server-only";
import { getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { AdminLevel } from "@/resources/tokens/token.types";
import { BadRequestError } from "@/handlers/errors";
import { AdminEntryT } from "@/resources/admins/admin.dto";
import { ListResponse } from "@/resources/globalTypes";

class AdminService {
  async create({ targetUserId }: {
    targetUserId: number;
  }) {
    await getTokenInfo({
      superAdmin: true,
    });
    await prisma.admin.create({
      data: {
        user: {
          connect: {
            id: targetUserId
          }
        }
      }
    });
  }

  async delete(adminId: number) {
    await getTokenInfo({
      superAdmin: true,
    });
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
  }

  async list({ page }: {
    page: number;
  }): Promise<ListResponse<AdminEntryT>> {
    const { userId, metadata } = await getTokenInfo({
      admin: true,
    });
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
        updatedAt: record.updatedAt,
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
  }
}

const adminService = new AdminService();
export default adminService;