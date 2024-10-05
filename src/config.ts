

// const fromLocal = false;
const fromLocal = (process.env.NEXT_PUBLIC_FROM_LOCAL ?? "false") == "true";
export const STAGE: string = process.env.NEXT_PUBLIC_STAGE ?? "dev";

export const [API_URL] = ((): [string] => {
  if ((STAGE as any) == "prod") {
    return ["https://kenaz-ip-prod.onomaai.kr"];
  } else {
    // dev
    if (fromLocal) {
      return ["http://localhost:3301"];
    } else {
      return ["https://kenaz-ip-dev.onomaai.kr"];
    }
  }
})();


// export const RESOURCE_HOST = "https://kenaz-ip.s3.ap-northeast-2.amazonaws.com";
export const RESOURCE_HOST = "https://dfcgxf5rq4aez.cloudfront.net/";
