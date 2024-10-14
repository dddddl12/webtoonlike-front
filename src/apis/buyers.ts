import { server } from "@/system/axios";
import type * as R from "@backend/types/Buyer.api";
import type { BuyerFormT } from "@backend/types/Buyer";
import { auth, clerkClient } from "@clerk/nextjs/server";

const root = "/buyers";

export async function create(form: BuyerFormT) {
  const { userId } = auth();
  await clerkClient.users.updateUserMetadata(userId!, {
    publicMetadata: {
      form,
    },
  });
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