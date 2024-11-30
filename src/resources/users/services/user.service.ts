import "server-only";
import { UserAccountFormT, UserFormT, UserTypeT } from "@/resources/users/dtos/user.dto";
import prisma from "@/utils/prisma";
import {
  getClerkUser,
  getTokenInfo,
  notAuthorizedErrorWithMessage,
  updateTokenInfo
} from "@/resources/tokens/token.service";
import { UnexpectedServerError } from "@/handlers/errors";
import { BuyerCompanySchema, BuyerFormT } from "@/resources/buyers/buyer.dto";
import { clerkClient } from "@clerk/nextjs/server";

class UserService {

  async create(formData: UserAccountFormT) {
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
        // todo
        if (!creator) {
          throw new UnexpectedServerError("Creator data is missing.");
        }
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
        if (!buyer) {
          throw new UnexpectedServerError("Buyer data is missing.");
        }
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

  async get(): Promise<UserAccountFormT> {
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
      addressLine2: record.addressLine2 ?? ""
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

  async delete() {
    const { userId } = await getTokenInfo();
    await prisma.$transaction(async (tx) => {
      const { sub } = await tx.user.delete({
        where: {
          id: userId
        }
      });
      await clerkClient().then(client => {
        client.users.deleteUser(sub);
      });
    });
  }
}

const userService = new UserService();
export default userService;