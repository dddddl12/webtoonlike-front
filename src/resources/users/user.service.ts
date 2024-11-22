import "server-only";
import { UserExtendedFormT, UserFormT, UserTypeT } from "@/resources/users/user.types";
import prisma from "@/utils/prisma";
import {
  getClerkUser,
  getTokenInfo,
  notAuthorizedErrorWithMessage,
  updateTokenInfo
} from "@/resources/tokens/token.service";
import { BuyerCompanySchema, BuyerFormT } from "@/resources/buyers/buyer.types";
import { AdminPageAccountT, NonAdminUserSearchQueryT } from "@/resources/users/user.controller";

class UserService {
  async create(formData: UserExtendedFormT) {
    // 저작권자/바이어까지 등록 후 생성으로 구조 변경
    await prisma.$transaction(async (tx) => {
      const clerkUser = await getClerkUser();
      // 기본 유저 생성
      const insert = {
        sub: clerkUser.id,
        email: clerkUser.primaryEmail,
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
        country: formData.country,
        postcode: formData.postcode,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
      };
      const { id: userId } = await tx.user.upsert({
        create: insert,
        update: insert,
        where: {
          sub: clerkUser.id
        },
        select: {
          id: true
        }
      });

      // 저작권자 생성
      if (formData.userType === UserTypeT.Creator) {
        const { creator } = formData;
        const insert = {
          ...creator,
          userId
        };

        await tx.creator.upsert({
          create: insert,
          update: insert,
          where: {
            userId
          }
        });

        // 바이어 생성
      } else if (formData.userType === UserTypeT.Buyer) {
        const { buyer } = formData;
        const insert = {
          ...buyer,
          userId
        };
        await tx.buyer.upsert({
          create: insert,
          update: insert,
          where: {
            userId
          }
        });
      }
      await updateTokenInfo(tx);
    });
  }

  async getSimple() {
    const clerkUser = await getClerkUser();
    const { name } = await prisma.user.findUniqueOrThrow({
      where: {
        id: parseInt(clerkUser.externalId)
      },
      select: {
        name: true
      }
    });
    return {
      name,
      thumbPath: clerkUser.imageUrl
    };
  }

  async get(): Promise<UserExtendedFormT> {
    const { userId } = await getTokenInfo();
    const record = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      },
      include: {
        buyer: true,
        creator: true
      }
    });
    const user: UserFormT = {
      name: record.name,
      phone: record.phone ?? undefined,
      userType: record.userType as UserTypeT,
      country: record.country as UserFormT["country"],
      postcode: record.postcode ?? "",
      addressLine1: record.addressLine1 ?? "",
      addressLine2: record.addressLine2 ?? "",
      agreed: true
    };
    if (record.userType === UserTypeT.Creator && record.creator) {
      const creatorRecord = record.creator;
      return {
        ...user,
        userType: UserTypeT.Creator,
        creator: {
          name: creatorRecord.name,
          name_en: creatorRecord.name_en ?? undefined,
          thumbPath: creatorRecord.thumbPath ?? undefined,
          isAgencyAffiliated: creatorRecord.isAgencyAffiliated,
          isExperienced: creatorRecord.isExperienced,
        }
      };
    } else if (record.userType === UserTypeT.Buyer && record.buyer) {
      const buyerRecord = record.buyer;
      return {
        ...user,
        userType: UserTypeT.Buyer,
        buyer: {
          company: BuyerCompanySchema.parse(buyerRecord.company),
          purpose: buyerRecord.purpose as BuyerFormT["purpose"] ?? undefined,
        }
      };
    }
    // 비정상적으로 creator 또는 buyer 레코드가 없을 경우
    throw await notAuthorizedErrorWithMessage();
  }

  async list({ page }: { page: number}) {
    await getTokenInfo({
      admin: true,
    });
    const limit = 5;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          name: true,
          userType: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);
    const items: AdminPageAccountT[] = records.map(r => {
      return {
        id: r.id,
        name: r.name,
        userType: r.userType as UserTypeT,
        createdAt: r.createdAt
      };
    });
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async searchNonAdminUsers({ q }: NonAdminUserSearchQueryT) {
    await getTokenInfo({
      admin: true,
    });
    const records = await prisma.user.findMany({
      take: 10,
      where: {
        AND: [
          {
            admin: {
              is: null
            }
          },
          {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive"
                }
              },
              {
                email: {
                  contains: q,
                  mode: "insensitive"
                }
              }
            ]
          }
        ]
      },
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true
      }
    });
    return records.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      userType: r.userType as UserTypeT
    }));
  }
}

const userService = new UserService();
export default userService;