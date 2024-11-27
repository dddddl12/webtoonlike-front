import { Prisma } from "@prisma/client";
import { OfferBaseUserT, OfferBuyerT, OfferCreatorT } from "@/resources/offers/dtos/offerUser.dto";
import { displayName } from "@/resources/displayName";
import { UnexpectedServerError } from "@/handlers/errors";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.dto";
import { UserTypeT } from "@/resources/users/dtos/user.dto";

type QueryOptions = {
  includeContactInfo: boolean;
};

class OfferUserHelper {
  private baseUserQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      id: true,
      sub: true,
      name: true,
      phone: true,
      email: true,
      userType: true,
    }
  });

  private baseUserMapToDTO = (
    r: Prisma.UserGetPayload<typeof this.baseUserQuery>,
    thumbPath: string | undefined,
    options?: QueryOptions
  ): OfferBaseUserT => {
    const dto: OfferBaseUserT = {
      id: r.id,
      name: r.name,
      userType: r.userType as UserTypeT,
      thumbPath,
    };
    if (options?.includeContactInfo) {
      dto.contactInfo = {
        phone: r.phone,
        email: r.email
      };
    }
    return dto;
  };

  creatorQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      ...this.baseUserQuery.select,
      creator: {
        select: {
          name: true,
          name_en: true,
          isAgencyAffiliated: true,
        }
      }
    }
  });

  creatorMapToDTO = (
    r: Prisma.UserGetPayload<typeof this.creatorQuery>,
    locale: string,
    thumbPath: string | undefined,
    options?: QueryOptions
  ): OfferCreatorT => {
    const { creator } = r;
    if (!creator) {
      throw new UnexpectedServerError("Creator not found");
    }
    return {
      isAgencyAffiliated: creator.isAgencyAffiliated,
      localized: {
        name: displayName(
          locale, creator.name, creator.name_en)
      },
      user: this.baseUserMapToDTO(r, thumbPath, options)
    };
  };

  buyerQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      ...this.baseUserQuery.select,
      // TODO 전반적으로 buyer 정보가 한 컬럼에 몰려있는 건 위험이 있음
      buyer: {
        select: {
          company: true,
        }
      },
    }
  });

  buyerMapToDTO = (
    r: Prisma.UserGetPayload<typeof this.buyerQuery>,
    thumbPath: string | undefined,
    options?: QueryOptions
  ): OfferBuyerT => {
    const { buyer } = r;
    if (!buyer) {
      throw new UnexpectedServerError("Buyer not found");
    }
    const company = BuyerCompanySchema.parse(buyer.company);
    return {
      name: company.name,
      dept: company.dept,
      position: company.position,
      user: this.baseUserMapToDTO(r, thumbPath, options)
    };
  };
}

const offerUserHelper = new OfferUserHelper();
export default offerUserHelper;