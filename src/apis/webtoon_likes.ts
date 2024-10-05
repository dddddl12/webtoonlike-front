import { server } from "@/system/axios";
import type * as R from "@/types/WebtoonLike.api";
import type { WebtoonLikeFormT, WebtoonLikeT } from "@/types/WebtoonLike";

const root = "/webtoon-likes";

export async function create(form: WebtoonLikeFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(root + "/", body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(root + `/${id}`);
  return rsp.data;
}
