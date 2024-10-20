import { RESOURCE_HOST } from "@/config";
import P from "path";
import * as BuyerApi from "@/apis/buyers";
import { uploadToS3 } from "@/utils/s3";

// TODO 이미지 보안

type ImageSizeT = "xxs"| "xs" | "sm" | "md" | "lg";

export function buildImgUrl(
  host: string|null,
  path: string,
  option: {size?: ImageSizeT} = {},
): string {
  if (host !== null) {
    return P.join(host, path);
  }
  let url = new URL(path, RESOURCE_HOST).toString();
  if (option.size) {
    url = `${url}?w=${getResizeW(option.size)}`;
  }
  return url;
}


function getResizeW(size: ImageSizeT): number{
  switch (size) {
  case "xxs":
    return 90;
  case "xs":
    return 180;
  case "sm":
    return 360;
  case "md":
    return 720;
  case "lg":
    return 1440;
  default:
    return 720;
  }
}

export class ImageData {
  private _fileOrPath: File | string;

  constructor(fileOrPath: File | string) {
    this._fileOrPath = fileOrPath;
  }

  get url(): string {
    if (this._fileOrPath instanceof File) {
      return URL.createObjectURL(this._fileOrPath);
    } else {
      return buildImgUrl(null, this._fileOrPath);
    }
  }

  async uploadFileAndGetStoragePath(): Promise<string> {
    if (this._fileOrPath instanceof File) {
      const file = this._fileOrPath;
      const { putUrl, key } = await BuyerApi.getThumbnailPresignedUrl(file.type);
      await uploadToS3(putUrl, file);
      this._fileOrPath = key;
    }
    return this._fileOrPath;
  }
}