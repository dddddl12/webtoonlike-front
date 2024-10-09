import jwt from "jsonwebtoken";
import { UserPublicMetadata } from "@/types";

export const authCookieName = "webtoonlike_auth";
export const getUserInfo = (token?: string): UserPublicMetadata => {
  if (!token) {
    token = document.cookie.split(";")
      .find((row) => row.trim().startsWith(`${authCookieName}=`))
      ?.split("=")[1];
  }
  if(token) {
    // TODO validation 포함 후 맞지 않으면 강제 로그아웃
    const decoded = jwt.decode(token, {
      json: true,
    })!;
    return {
      id: Number(decoded.sub),
      type: decoded.userType,
      adminLevel: decoded.adminLevel,
    };
  } else {
    return {
      id: -1,
      type: "guest",
      adminLevel: 0
    };
  }
};
