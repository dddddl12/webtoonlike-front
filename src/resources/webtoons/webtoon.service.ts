"use server";

import prisma from "@/utils/prisma";
import { Prisma, Webtoon as WebtoonRecord } from "@prisma/client";
import {
  AgeLimit,
  HomeArtistItem,
  HomeWebtoonItem,
  TargetAge, TargetGender,
  WebtoonFormT,
  WebtoonT
} from "@/resources/webtoons/webtoon.types";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { getUserMetadata } from "@/resources/userMetadata/userMetadata.service";
import { UserTypeT } from "@/resources/users/user.types";
import { WrongUserTypeError } from "@/errors";

type BidRoundFilter = BidRoundStatus[] | "any" | "none"

const mapToDTO = (record: WebtoonRecord): WebtoonT => ({
  ...record,
  targetAge: record.targetAge
    .map(a => TargetAge[a as keyof typeof TargetAge]),
  ageLimit: AgeLimit[record.ageLimit as keyof typeof AgeLimit],
  targetGender: TargetGender[record.ageLimit as keyof typeof TargetGender],
});

// export async function createWebtoon(form: WebtoonFormT): Promise<WebtoonT> {
//   const created = await webtoonM.create(form);
//   if (!created) {
//     throw new err.NotAppliedE();
//   }
//   return created;
// }

export async function getWebtoon(id: number): Promise<WebtoonT> {
  // TODO 에러 핸들링
  return prisma.webtoon.findUniqueOrThrow({
    where: { id },
    include: {
      WebtoonEpisode: true,
      BidRound: true,
    }
  }).then(record => ({
    ...mapToDTO(record),
    episodes: record.WebtoonEpisode,
    bidRounds: record.BidRound,
  }));
}

// export async function updateWebtoon(id: number, form: Partial<WebtoonFormT>): Promise<WebtoonT> {
//   const updated = await webtoonM.updateOne({ id }, form);
//   if (!updated) {
//     throw new err.NotAppliedE();
//   }
//   return updated;
// }

export async function listMyWebtoonsWithNoRounds({ page }: {
  page?: number
} = {}) {
  const userMetadata = await getUserMetadata();
  if(userMetadata.type !== UserTypeT.Creator) {
    throw new WrongUserTypeError();
  }
  const { creatorId } = userMetadata;
  return listWebtoons({
    creatorId, page,
    statuses: "none",
    limit: 5
  });
}

export async function listWebtoons({
  statuses, genreId, ageLimit, creatorId,
  page = 1,
  limit = 10
}: {
  statuses?: BidRoundFilter;
  genreId?: number;
  ageLimit?: AgeLimit;
  page?: number;
  creatorId?: number;
  limit?: number;
} = {}): Promise<{
    items: WebtoonT[];
    totalPages: number;
  }> {
  const where: Prisma.WebtoonWhereInput = {
    authorId: creatorId,
    ageLimit: ageLimit,
    BidRound: getBidRoundFilter(statuses),
    XWebtoonGenre: genreId ? {
      some: { genreId }
    } : undefined,
  };

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.webtoon.count({ where })
  ]);
  return {
    items: records.map(mapToDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

const getBidRoundFilter = (statuses?:BidRoundFilter): Prisma.BidRoundListRelationFilter | undefined => {
  if (!statuses) {
    return;
  } else if (statuses === "any") {
    return {
      some: {}
    };
  } else if (statuses === "none") {
    return {
      none: {}
    };
  } else if (Array.isArray(statuses)) {
    return statuses.length > 0 ? {
      some: {
        status: {
          in: statuses
        },
      },
    } : undefined;
  }
  throw new Error("Unknown statuses");
};


// export async function getThumbnailPresignedUrl(mimeType: string) {
//   let key = `webtoons/thumbnails/thumbnail_${new Date().getTime()}.${mime.extension(mimeType)}`;
//   key = putDevPrefix(key);
//   const putUrl = await createSignedUrl(key, mimeType);
//   return { putUrl, key };
// }


export async function homeItems() {
  // Using Prisma's transaction to run all queries concurrently
  const where: Prisma.WebtoonWhereInput = {
    BidRound: {
      some: {
        status: {
          in: [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
        },
      },
    },
  };
  const select: Prisma.WebtoonSelect = {
    id: true,
    title: true,
    title_en: true,
    author: {
      select: {
        id: true,
        name: true,
        name_en: true,
      },
    },
    thumbPath: true,
  };
  const [popularRecords, brandNewRecords, perGenreRecords, artists] = await prisma.$transaction(async (tx) => {
    return Promise.all([
      // 인기 웹툰
      tx.webtoon.findMany({
        where,
        select,
        orderBy: [
          { likes: "desc" },
          { createdAt: "desc" },
        ],
        take: 4
      }),

      // 최신
      tx.webtoon.findMany({
        where,
        select,
        orderBy: [
          { createdAt: "desc" },
        ],
        take: 5
      }),

      // 장르
      tx.webtoon.findMany({
        where,
        select,
        take: 10
      }),

      // 작가
      tx.webtoon.groupBy({
        by: ["authorId"],
        _count: {
          authorId: true,
        },
        where: {
          authorId: {
            not: null,
          },
        },
        orderBy: {
          _count: {
            authorId: "desc",
          },
        },
        take: 5
      }).then(async (records) => {
        const authors = records
          .map((record) => ({
            id: record.authorId,
            numOfWebtoons: record._count.authorId,
          }));

        const creatorRecords = await tx.creator.findMany({
          where: {
            id: {
              in: authors
                .map((author) => author.id)
                .filter(id => id !== null),
            }
          }
        });
        const artists: HomeArtistItem[] = creatorRecords.map(creatorRecord => ({
          id: creatorRecord.id,
          name: creatorRecord.name,
          name_en: creatorRecord.name_en,
          numOfWebtoons: authors.find(author => author.id === creatorRecord.id)?.numOfWebtoons || 0,
          thumbPath: creatorRecord.thumbPath,
        }));
        return artists;
      })
    ]);
  });

  const [popular, brandNew, perGenre]: HomeWebtoonItem[][] = [popularRecords, brandNewRecords, perGenreRecords]
    .map(group => {
      return group.map(item => ({
        id: item.id,
        title: item.title,
        title_en: item.title_en,
        creatorName: item.author?.name || null,
        creatorName_en: item.author?.name || null,
        thumbPath: item.thumbPath,
      }));
    });

  return {
    popular,
    brandNew,
    perGenre,
    artists
  };
}
