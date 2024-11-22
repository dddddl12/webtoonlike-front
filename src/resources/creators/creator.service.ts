import "server-only";

import prisma from "@/utils/prisma";
import { AdminPageCreatorT, ChangeExposedT } from "@/resources/creators/creator.controller";
import { getTokenInfo } from "@/resources/tokens/token.service";

class CreatorService {
  async getByUserId(userId: number) {
    await getTokenInfo({
      admin: true,
      buyer: true,
    });
    const record = await prisma.creator.findUniqueOrThrow({
      where: {
        userId,
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
  }

  async list({ page }: {
    page: number;
  }) {
    await getTokenInfo({
      admin: true,
    });
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

  async changeExposed(creatorId: number, { isExposed }: ChangeExposedT) {
    await getTokenInfo({
      admin: true,
    });
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
  }
}

const creatorService = new CreatorService();
export default creatorService;