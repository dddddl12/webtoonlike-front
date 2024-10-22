"use server";

import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { HomeArtistItem, HomeWebtoonItem, WebtoonFormT, WebtoonT } from "@/resources/webtoons/webtoon.types";

// export async function updateAggr(id: idT, opt: WebtoonAggrOptionT = {}): Promise<void> {
//   return await updateAggr(id, opt);
// }

export async function createWebtoon(form: WebtoonFormT): Promise<WebtoonT> {
  const created = await webtoonM.create(form);
  if (!created) {
    throw new err.NotAppliedE();
  }
  return created;
}

export async function getWebtoon(id: number, getOpt: GetWebtoonOptionT = {}): Promise<WebtoonT> {
  return webtoonM.findById(id, {
    builder: (qb, select) => {
      lookupBuilder(select, getOpt);
    }
  });
}

export async function updateWebtoon(id: number, form: Partial<WebtoonFormT>): Promise<WebtoonT> {
  const updated = await webtoonM.updateOne({ id }, form);
  if (!updated) {
    throw new err.NotAppliedE();
  }
  return updated;
}

export async function listWebtoons(listOpt: ListWebtoonOptionT): Promise<ListData<WebtoonT>> {
  return await listWebtoon(listOpt);
}

export async function getThumbnailPresignedUrl(mimeType: string) {
  let key = `webtoons/thumbnails/thumbnail_${new Date().getTime()}.${mime.extension(mimeType)}`;
  key = putDevPrefix(key);
  const putUrl = await createSignedUrl(key, mimeType);
  return { putUrl, key };
}


export async function homeItems() {
  // Using Prisma's transaction to run all queries concurrently
  const where = {
    BidRound: {
      some: {
        status: {
          in: ["bidding", "negotiating"], // Filters webtoons where bidStatus is "bidding" or "negotiating"
        },
      },
    },
  };
  const select = {
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
        take: 5
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
