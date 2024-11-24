import { Prisma } from "@prisma/client";
import { UnexpectedServerError } from "@/handlers/errors";
import { displayName } from "@/resources/displayName";
import webtoonHelper from "@/resources/webtoons/helpers/webtoon.helper";
import { WebtoonDetailsT } from "@/resources/webtoons/dtos/webtoonDetails.dto";

class WebtoonDetailsHelper {
  query = Prisma.validator<Prisma.WebtoonDefaultArgs>()({
    include: {
      user: {
        select: {
          creator: {
            select: {
              name: true,
              name_en: true,
            }
          }
        }
      },
      genreLinks: {
        select: {
          genre: {
            select: {
              id: true,
              label: true,
              label_en: true
            }
          }
        },
        orderBy: {
          genre: {
            rank: Prisma.SortOrder.asc
          }
        }
      },
    },
  });

  mapToDTO = (r: Prisma.WebtoonGetPayload<typeof this.query>, locale: string): WebtoonDetailsT => {
    const webtoonDto = webtoonHelper.mapToDTO(r, locale);
    const { creator } = r.user;
    if (!creator) {
      throw new UnexpectedServerError("Creator should exist.");
    }
    return {
      ...webtoonDto,
      localized: {
        ...webtoonDto.localized,
        authorOrCreatorName: displayName(locale, r.authorName, r.authorName_en)
          ?? displayName(locale, creator.name, creator.name_en)
      },
      genres: r.genreLinks
        .map(l=> ({
          id: l.genre.id,
          localized: {
            label: displayName(locale, l.genre.label, l.genre.label_en)
          }
        })),
    };
  };
}

const webtoonDetailsHelper = new WebtoonDetailsHelper();
export default webtoonDetailsHelper;

