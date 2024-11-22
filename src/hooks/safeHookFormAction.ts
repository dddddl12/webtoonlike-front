import { Infer, Schema } from "next-safe-action/adapters/types";
import { HookSafeActionFn } from "next-safe-action/hooks";
import { Resolver } from "react-hook-form";
import {
  HookProps,
  useHookFormAction,
  UseHookFormActionHookReturn
} from "@next-safe-action/adapter-react-hook-form/hooks";
import useClientActionHandler from "@/handlers/clientErrorHandler";
import { ActionErrorT } from "@/handlers/errors";

// 기존 유저 액션에 커스텀 에러 핸들링 추가
// 절대로 useHookFormAction를 다이렉트로 사용하지 말 것
export default function useSafeHookFormAction<
  ServerError extends ActionErrorT,
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
    hookFormResolver,
    {
      ...props,
      actionProps: {
        ...actionProps,
        onSettled: (args) => {
          form.reset(args.input);
          actionProps.onSettled?.(args);
        }
      }
    });
  return { form, ...rest };
}
