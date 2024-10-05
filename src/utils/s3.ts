import axios from "axios";

export async function uploadToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (amount: number) => void
): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: onProgress
      ? (e): void => onProgress(e.loaded / (e.total ?? 1))
      : undefined,
  });
}
