import { SafeActionResult } from "next-safe-action";
import { Schema } from "next-safe-action/adapters/types";
import { ActionErrorT } from "@/handlers/errors";

export async function responseHandler<S extends Schema | undefined, BAS extends readonly Schema[], CVE, CBAVE, Data>(
  result: SafeActionResult<ActionErrorT, S, BAS, CVE, CBAVE, Data> | undefined
) {
  // throw new Error("not implemented");
  if (result?.serverError){
    throw Error(JSON.stringify(result.serverError));
  }
  return result?.data;
}