import { useForm, UseFormProps } from "react-hook-form";
import { HookCallbacks, HookSafeActionFn } from "next-safe-action/hooks";
import { InferIn, Schema } from "next-safe-action/adapters/types";
import useSafeAction from "@/hooks/safeAction";
import { ActionErrorT } from "@/handlers/errors";
import { FormEvent, useState } from "react";
import { ValidationErrors } from "next-safe-action";
import { useHookFormActionErrorMapper } from "@next-safe-action/adapter-react-hook-form/hooks";

/**
 * 기본적으로 @next-safe-action/adapter-react-hook-form 의 아이디어를 착안했으나,
 * 해당 모듈이 본 프로젝트의 성격과 정확히 맞지는 않아서 여기서 재구성하고
 * useHookFormActionErrorMapper 함수만 차용
*/

type Props<
  ServerError extends ActionErrorT,
  S extends Schema,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
  FormContext = any,
> = UseFormProps<S extends Schema ? InferIn<S> : void, FormContext> & {
  actionProps: HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data>;
  beforeSubmission?: () => Promise<void>;
};

export default function useSafeActionForm<
  S extends Schema,
  ServerError extends ActionErrorT,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
  FormContext = any,
>(
  action: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  props: Props<ServerError, S, BAS, CVE, CBAVE, Data, FormContext>
){
  const { actionProps, beforeSubmission, ...formProps } = props;

  /* native formState.isSubmitting 에 의존하지 않는 이유
  * 1. beforeSubmission 동작을 인식하지 못함
  * 2. 제출 완료 후 onSuccess 동작을 수행하기 전에 일정한 딜레이 발생
  * - 혼동을 피하기 위해 isFormSubmitting로 rename*/
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const actionReturn = useSafeAction(action, {
    ...actionProps,
    onSuccess: (args) => {
      actionProps.onSuccess?.(args);
      setIsFormSubmitting(false);
    },
    onError: (args) => {
      actionProps.onError?.(args);
      setIsFormSubmitting(false);
    },
    ignoreValidationError: true,
  });
  const { hookFormValidationErrors } = useHookFormActionErrorMapper<S>(
    actionReturn.result.validationErrors as ValidationErrors<S> | undefined
  );
  const form = useForm<S extends Schema ? InferIn<S> : void, FormContext>({
    ...formProps,
    errors: hookFormValidationErrors,
  });

  const onSubmit = async (e?: FormEvent<HTMLFormElement|HTMLButtonElement>) => {
    e?.preventDefault();
    // 제출 중에 필드들을 CSS로 disabled 처럼 보이게 처리하는데, 엔터 버튼으로 제출할 경우 포커스가 인풋 필드에 남아있는 문제가 있어서 강제 blur 처리
    (document.activeElement as HTMLElement | null)?.blur();
    setIsFormSubmitting(true);
    if (beforeSubmission) {
      await beforeSubmission();
    }
    await form.handleSubmit(async (formData) => {
      return actionReturn.executeAsync(formData);
    })();
  };

  return {
    isFormSubmitting, form, onSubmit
  };
}
