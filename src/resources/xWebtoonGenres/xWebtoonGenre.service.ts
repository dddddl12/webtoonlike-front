// import { Injectable } from "@nestjs/common";
// import * as err from "@/errors";
// import { xWebtoonGenreM } from "@/models/xWebtoonGenres";
// import type { XWebtoonGenreFormT, XWebtoonGenreT } from "@/types";
//
// @Injectable()
// export class XWebtoonGenreService {
//   constructor() {}
//
//   async create(form: XWebtoonGenreFormT): Promise<XWebtoonGenreT> {
//     const created = await xWebtoonGenreM.create(form);
//     if (!created) {
//       throw new err.NotAppliedE();
//     }
//     return created;
//   }
//
//   async resetByWebtoon(webtoonId: idT): Promise<void> {
//     await xWebtoonGenreM.deleteMany({ webtoonId });
//   }
//
//
//   async remove(webtoonId: idT, genreId: idT): Promise<XWebtoonGenreT> {
//     const deleted = await xWebtoonGenreM.deleteOne({ webtoonId, genreId });
//     if (!deleted) {
//       throw new err.NotAppliedE();
//     }
//     return deleted;
//   }
//
//
// }