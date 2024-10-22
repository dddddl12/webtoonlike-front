import { RESOURCE_HOST } from "@/config";
import P from "path";
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
  private readonly _fileOrPath: File | string;

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
}