import { InferIn, Schema } from "next-safe-action/adapters/types";
import { SafeActionResult } from "next-safe-action";
import { showAlert } from "@/hooks/alert";
import { HookBaseUtils, HookCallbacks } from "next-safe-action/hooks";
import { ActionErrorT } from "@/handlers/errors";
import { useTranslations } from "next-intl";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export default function useClientActionHandler<
  ServerError extends ActionErrorT,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
>(
  actionProps?: HookBaseUtils<S> & HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data>,
  options?: {
    reportValidationError?: boolean;
    // useSafeAction 전용. 이 경우 요청 파라미터가 잘못되어도 버그 여부를 표시할 방법이 없기 때문
    // 반면 useSafeHookFormAction을 사용하는 경우에는 form에 에러값이 표시되므로 이 값을 false로 할 것
  }
) {
  const t = useTranslations("errors");
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
      const { serverError, validationErrors, bindArgsValidationErrors } = error;

      if (serverError) {
        showAlert({
          type: "alert",
          props: {
            title: serverError.title,
            message: serverError.message
          }
        });
      } else if ((validationErrors && options?.reportValidationError)
      || bindArgsValidationErrors) {
        // 클라이언트 측 코딩 오류
        // 정상적 상황에서는 발생해서는 안됨
        showAlert({
          type: "alert",
          props: {
            title: t("UnexpectedError.title"),
            message: t("UnexpectedError.message"),
          }
        });
      }
    }
  };
}

