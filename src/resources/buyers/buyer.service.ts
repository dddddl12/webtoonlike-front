import "server-only";
import prisma from "@/utils/prisma";
import { BuyerCompanySchema, PublicBuyerInfoT } from "@/resources/buyers/buyer.types";

class BuyerService {
  // todo 인증 방식 확인
  async getPublicByUserId(userId: number): Promise<PublicBuyerInfoT> {
    const record = await prisma.buyer.findUniqueOrThrow({
      where: {
        userId
      },
      select: {
        company: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });
    const company = BuyerCompanySchema.parse(record.company);
    return {
      username: record.user.name,
      company: {
        name: company.name,
        thumbPath: company.thumbPath,
        dept: company.dept,
        position: company.position,
      }
    };
  }
}

const buyerService = new BuyerService();
export default buyerService;