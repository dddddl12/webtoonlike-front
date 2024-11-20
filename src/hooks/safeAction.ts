import { HookSafeActionFn, HookBaseUtils, HookCallbacks, UseActionHookReturn, useAction } from "next-safe-action/hooks";
import { Schema } from "next-safe-action/adapters/types";
import useClientActionHandler from "@/handlers/clientErrorHandler";
import { ActionErrorT } from "@/handlers/errors";

// 기존 유저 액션에 커스텀 에러 핸들링 추가
// 절대로 useAction를 다이렉트로 사용하지 말 것
export default function useSafeAction<
  ServerError extends ActionErrorT,
  S extends Schema | undefined,
  const BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
>(
  safeActionFn: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  utils?: HookBaseUtils<S> & HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data>
): UseActionHookReturn<ServerError, S, BAS, CVE, CBAVE, Data> {
  const actionProps = useClientActionHandler(utils);
  return useAction(safeActionFn, actionProps);
}
