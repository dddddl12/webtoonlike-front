import { RESOURCE_HOST } from "@/config";
import { generatePreSignedUrl } from "@/resources/files/files.service";
import { fileTypeFromBlob } from "file-type";
import { FileDirectoryT } from "@/resources/files/files.type";
import axios from "axios";

type ImageSizeT = "xxs"| "xs" | "sm" | "md" | "lg";
type FallbackT = "user";

// 이미지 path가 required일 때
export function buildImgUrl(path: string, option?: {
  size?: ImageSizeT;
}): string;
// 이미지 path가 optional일 때
export function buildImgUrl(path: string | undefined, option: {
  fallback: FallbackT; size?: ImageSizeT;
}): string;
export function buildImgUrl(
  path: string | undefined,
  option?: { fallback?: FallbackT; size?: ImageSizeT },
): string {
  if (path) {
    let url = new URL(path, RESOURCE_HOST).toString();
    if (option?.size) {
      url = `${url}?w=${getResizeW(option.size)}`;
    }
    return url;
  }
  switch (option?.fallback) {
  case "user":
    return "/img/mock_profile_image.png";
  }
  throw new Error("Invalid option");
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

export class ImageObject {
  private readonly _fileOrPath?: File | string;
  url?: string;
  displayUrl?: string;

  constructor(fileOrPath?: File | string) {
    this._fileOrPath = fileOrPath;

    if (fileOrPath instanceof File) {
      this.url = URL.createObjectURL(fileOrPath);
      this.displayUrl = fileOrPath.name;
    } else if (typeof fileOrPath === "string") {
      this.url = buildImgUrl(fileOrPath, { size: "sm" });
      this.displayUrl = this.url;
    }
  }

  async uploadAndGetRemotePath(directory: FileDirectoryT): Promise<string | undefined> {
    if (!(this._fileOrPath instanceof File)) {
      return this._fileOrPath;
    }
    const file = this._fileOrPath;
    const fileType = await fileTypeFromBlob(file);
    if (!fileType) {
      return;
    }
    const { preSignedUrl, urlPath } = await generatePreSignedUrl(directory, fileType);
    await axios.put(preSignedUrl, file, {
      headers: { "Content-Type": file.type },
    });
    return urlPath;
  }
}