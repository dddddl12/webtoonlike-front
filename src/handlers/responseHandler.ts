import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { SafeActionResult } from "next-safe-action";
import { Schema } from "next-safe-action/adapters/types";
import { ActionError } from "@/handlers/safeAction";

export async function responseHandler<S extends Schema | undefined, BAS extends readonly Schema[], CVE, CBAVE, Data>(
  result: SafeActionResult<ActionError, S, BAS, CVE, CBAVE, Data> | undefined
) {
  console.log(result);
  if (result?.data) {
    return result.data;
  }
  const locale = await getLocale();
  redirect(`/${locale}/error?code=${result?.serverError?.name ?? "unknown"}`);
}