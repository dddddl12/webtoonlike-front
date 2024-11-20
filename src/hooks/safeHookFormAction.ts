import { Infer, Schema } from "next-safe-action/adapters/types";
import { HookSafeActionFn } from "next-safe-action/hooks";
import { Resolver } from "react-hook-form";
import {
  HookProps,
  useHookFormAction,
  UseHookFormActionHookReturn
} from "@next-safe-action/adapter-react-hook-form/hooks";
import useClientActionHandler from "@/handlers/clientErrorHandler";
import { ActionError } from "@/handlers/safeAction";

// 기존 유저 액션에 커스텀 에러 핸들링 추가
// 절대로 useHookFormAction를 다이렉트로 사용하지 말 것
export default function useSafeHookFormAction<
  ServerError extends ActionError,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
  FormContext = any,
>(
  safeAction: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  hookFormResolver: Resolver<S extends Schema ? Infer<S> : any, FormContext>,
  props?: HookProps<ServerError, S, BAS, CVE, CBAVE, Data, FormContext>
): UseHookFormActionHookReturn<ServerError, S, BAS, CVE, CBAVE, Data, FormContext>{
  const actionProps = useClientActionHandler(props?.actionProps);
  const { form, ...rest } = useHookFormAction(
    safeAction,
    (values, ...rest) => {
      // 값이 없으면 DB에 null로 저장하여 헷갈리는 일 없도록 할 것
      values = removeBlankStrings(values);
      return hookFormResolver(values, ...rest);
    },
    {
      ...props,
      actionProps: {
        ...actionProps,
        onError: (args) => {
          form.reset(args.input);
          actionProps.onError(args);
        }
      }
    });
  return { form, ...rest };
}

function removeBlankStrings(obj: any): any {
  if (Array.isArray(obj)) {
    // 배열인 경우
    return obj.map(removeBlankStrings)
      .filter((value) => value !== "");
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter((entry) => entry[1] !== "") // blank 제거
        .map(([key, value]) => [key, removeBlankStrings(value)]) // nested
    );
  }
  return obj;
}
