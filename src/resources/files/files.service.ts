"use server";

import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { STAGE } from "@/config";
import { FileDirectoryT } from "@/resources/files/files.type";
import { FileTypeResult } from "file-type";

export async function generatePreSignedUrl(directory: FileDirectoryT, fileType: FileTypeResult) {
  let computedDirectory: string = directory;
  if(STAGE === "dev") {
    computedDirectory = "dev/" + directory;
  }
  const key = `${computedDirectory}/${uuidv4()}.${fileType.ext}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: fileType.mime
  });
  const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 * 7 });
  return {
    preSignedUrl,
    urlPath: key
  };
}

const s3Client = new S3Client({
  region: process.env.S3_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_KEY_ID || "",
  },
});
