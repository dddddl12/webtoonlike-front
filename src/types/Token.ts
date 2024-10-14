import { UserTypeT } from "@/types/User";
import { JwtPayload } from "jsonwebtoken";

export interface TokenT extends JwtPayload {
  jti: string;
  sub: string;
  userType: UserTypeT;
  adminLevel: 0 | 1 | 2; // 0: 비관리자, 1: 일반 관리자, 2: 수퍼 관리자
  iat: number;
  exp: number;
}

export interface CreateTokenOptionT {
  clerkToken: string;
}

export interface TokenRsp {
  token: string;
}
