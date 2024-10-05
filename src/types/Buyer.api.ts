import type { BuyerFormT, BuyerT } from "./Buyer";

// (POST) /
export type CreateRqs = {
  form: BuyerFormT
}
export type CreateRsp = BuyerT


// (POST) /thumbnail/presigned-url
export type ThumbnailPresignedUrlRqs = { mimeType: string }
export type ThumbnailPresignedUrlRsp = { putUrl: string, key: string }

// (POST) /business-cert/presigned-url
export type BusinessCertPresignedUrlRqs = { mimeType: string }
export type BusinessCertPresignedUrlRsp = { putUrl: string, key: string }

// (POST) /business-card/presigned-url
export type BusinessCardPresignedUrlRqs = { mimeType: string }
export type BusinessCaardPresignedUrlRsp = { putUrl: string, key: string }