import { HookSafeActionFn, HookCallbacks, UseActionHookReturn, useAction } from "next-safe-action/hooks";
import { InferIn, Schema } from "next-safe-action/adapters/types";
import { ActionErrorT } from "@/handlers/errors";
import { useTranslations } from "next-intl";
import { SafeActionResult } from "next-safe-action";
import { showAlert } from "@/hooks/alert";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

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
  utils?: HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data> & {
    ignoreValidationError?: boolean;
    // useSafeActionForm을 사용하는 경우에는 form에 에러값이 표시되므로 ValidationError 발생 시 모달 표시를 무시
  }
): UseActionHookReturn<ServerError, S, BAS, CVE, CBAVE, Data> {
  const t = useTranslations("errors");
  return useAction(safeActionFn, {
    ...utils,
    onError: (args: {
      error: Prettify<Omit<SafeActionResult<ServerError, S, BAS, CVE, CBAVE, Data>, "data">>;
      input: S extends Schema ? InferIn<S> : undefined;
    }) => {
      if (utils?.onError){
        // 개별 인스턴스에서 직접 에러를 지정한 경우
        utils.onError(args);
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
      } else if ((validationErrors && !utils?.ignoreValidationError)
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
  });
}
