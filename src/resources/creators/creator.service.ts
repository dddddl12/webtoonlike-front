import "server-only";

import prisma from "@/utils/prisma";
import { ChangeExposedT } from "@/resources/creators/creator.controller";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { AdminPageCreatorT, PublicCreatorT } from "@/resources/creators/creator.dto";
import { displayName } from "@/resources/displayName";
import { getLocale } from "next-intl/server";
import { ListResponse } from "@/resources/globalTypes";
import creatorHelper from "@/resources/creators/creator.helper";

class CreatorService {
  async getByUserId(userId: number): Promise<PublicCreatorT> {
    await getTokenInfo({
      admin: true,
      buyer: true,
    });
    const record = await prisma.creator.findUniqueOrThrow({
      where: {
        userId,
        // isExposed: true,
        //   todo
      },
      select: {
        name: true,
        name_en: true,
        thumbPath: true,
      }
    });
    const locale = await getLocale();
    return {
      thumbPath: record.thumbPath ?? undefined,
      localized: {
        name: displayName(locale, record.name, record.name_en)
      }
    };
  }

  async list({ page }: {
    page: number;
  }): Promise<ListResponse<AdminPageCreatorT>> {
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
        ...creatorHelper.adminPageQuery
      }),
      prisma.creator.count()
    ]);
    const items = records.map(creatorHelper.adminPageMapToDTO);
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async changeExposed(creatorId: number, { isExposed }: ChangeExposedT): Promise<ChangeExposedT> {
    await getTokenInfo({
      admin: true,
    });
    // throw new NotAuthorized("Not implemented");
    const r = await prisma.creator.update({
      ...creatorHelper.adminPageQuery,
      where: {
        id: creatorId
      },
      data: {
        isExposed
      }
    });
    return creatorHelper.adminPageMapToDTO(r);
  }
}

const creatorService = new CreatorService();
export default creatorService;