import { server } from "@/system/axios";
import type * as R from "@backend/types/WebtoonLike.api";
import type { WebtoonLikeFormT, WebtoonLikeT } from "@backend/types/WebtoonLike";

const root = "/webtoon-likes";

export async function create(webtoonId: idT): Promise<R.CreateRsp> {
  const rsp = await server.post(root + `/${webtoonId}`);
  return rsp.data;
}

export async function remove(webtoonId: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(root + `/${webtoonId}`);
  return rsp.data;
}
