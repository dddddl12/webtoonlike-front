import { server } from "@/system/axios";
import type * as R from "@backend/types/XWebtoonGenre.api";
import type { XWebtoonGenreFormT } from "@backend/types/XWebtoonGenre";

const root = "/x-webtoon-genres";


export async function create(form: XWebtoonGenreFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function resetByWebtoon(webtoonId: idT): Promise<R.ResetByWebtoonRsp> {
  const body: R.ResetByWebtoonRqs = { webtoonId };
  const rsp = await server.post(`${root}/reset-by-webtoon`, body);
  return rsp.data;

}