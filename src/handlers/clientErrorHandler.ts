import { InferIn, Schema } from "next-safe-action/adapters/types";
import { SafeActionResult } from "next-safe-action";
import { showAlert } from "@/hooks/alert";
import { HookBaseUtils, HookCallbacks } from "next-safe-action/hooks";
import { ActionError } from "@/handlers/safeAction";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export default function useClientActionHandler<
  ServerError extends ActionError,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
>(
  actionProps?: HookBaseUtils<S> & HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data>
) {
  return {
    ...actionProps,
    onError: (args: {
      error: Prettify<Omit<SafeActionResult<ServerError, S, BAS, CVE, CBAVE, Data>, "data">>;
      input: S extends Schema ? InferIn<S> : undefined;
    }) => {
      if (actionProps?.onError){
        // 개별 인스턴스에서 직접 에러를 지정한 경우
        actionProps.onError(args);
      }
      // 여기서부터 공통 에러 핸들링
      const { error } = args;
      const { serverError } = error;
      if (serverError) {
        showAlert({
          type: "alert",
          props: {
            title: serverError.title,
            message: serverError.message
          }
        });
      }
      // TODO 없애기
      console.log(args);
    }
  };
}

