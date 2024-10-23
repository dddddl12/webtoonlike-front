// "use server";
//
// import prisma from "@/utils/prisma";
//
// export async function get(id: number, getOpt: GetCreatorOptionT = {}): Promise<CreatorT> {
//   return creatorM.findById(id, {
//     builder: (qb,select) => {
//       lookupBuilder(select, getOpt);
//     }
//   });
// }
//
// export async function create(form: CreatorFormT): Promise<CreatorT> {
//   const created = await creatorM.upsert(form, { onConflict: ["userId"] });
//   if (!created) {
//     throw new err.NotAppliedE();
//   }
//   return created;
// }
//
// export async function update(id: idT, form: Partial<CreatorFormT>): Promise<CreatorT> {
//   const updated = await creatorM.updateOne({ id }, form);
//   if (!updated) {
//     throw new err.NotAppliedE();
//   }
//   return updated;
// }
//
// export async function getThumbnailPresignedUrl(mimeType: string) {
//   let key = `creators/thumbnails/thumbnail_${new Date().getTime()}.${mime.extension(mimeType)}`;
//   key = putDevPrefix(key);
//   const putUrl = await createSignedUrl(key, mimeType);
//   return { putUrl, key };
// }
