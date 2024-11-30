import "server-only";
import { Prisma } from "@prisma/client";
import { OfferBaseUserT, OfferBuyerT, OfferCreatorT } from "@/resources/offers/dtos/offerUser.dto";
import { displayName } from "@/resources/displayName";
import { UnexpectedServerError } from "@/handlers/errors";
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
      buyer: {
        select: {
          name: true,
          department: true,
          position: true,
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
    return {
      name: buyer.name,
      department: buyer.department,
      position: buyer.position,
      user: this.baseUserMapToDTO(r, thumbPath, options)
    };
  };
}

const offerUserHelper = new OfferUserHelper();
export default offerUserHelper;