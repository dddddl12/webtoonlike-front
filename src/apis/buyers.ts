import { server } from "@/system/axios";
import type * as R from "@/types/Buyer.api";
import type { BuyerFormT } from "@/types/Buyer";

const root = "/buyers";

export async function create(form: BuyerFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function getThumbnailPresignedUrl(mimeType: string): Promise<R.ThumbnailPresignedUrlRsp> {
  const body: R.ThumbnailPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/thumbnail/presigned-url`, body);
  return rsp.data;
}

export async function getBusinessCertPresignedUrl(mimeType: string): Promise<R.BusinessCertPresignedUrlRsp> {
  const body: R.BusinessCertPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/business-cert/presigned-url`, body);
  return rsp.data;
}

export async function getBusinessCardPresignedUrl(mimeType: string): Promise<R.BusinessCaardPresignedUrlRsp> {
  const body: R.BusinessCardPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/business-card/presigned-url`, body);
  return rsp.data;
}