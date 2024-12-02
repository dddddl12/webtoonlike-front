"use client";

import { useEffect } from "react";
import { ActionErrorSchema, ActionErrorT } from "@/handlers/errors";
import { useTranslations } from "next-intl";
import z from "zod";
import ErrorPage from "@/components/shared/ErrorPage";

// todo 특수 에러의 경우 특수 처리
export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  const t = useTranslations("errors");
  const actionError: ActionErrorT = z.string()
    .refine((str) => {
      // json으로 파싱 가능한지 확인
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    }, { message: "Invalid JSON format" })
    .transform((str) => JSON.parse(str))
    .pipe(ActionErrorSchema).safeParse(error.message).data
    ?? {
      // ActionErrorSchema 스키마가 아닌 경우 클라이언트 에러
      httpCode: -1,
      name: error.name,
      title: t("UnexpectedError.title"),
      message: t("UnexpectedError.message"),
    };

  return <ErrorPage actionError={actionError}/>;
}