import { server } from "@/system/axios";
import { CreateTokenOptionT, TokenRsp } from "@backend/types/Token";

const root = "/tokens";

// (POST) /
export async function create(createOpt: CreateTokenOptionT): Promise<TokenRsp> {
  const rsp = await server.post(root, createOpt);
  return rsp.data;
}

// (DELETE) /
export async function revoke() {
  await server.delete(root);
}
