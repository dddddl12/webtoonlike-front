"use client";

import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { ActionErrorSchema, ActionErrorT } from "@/handlers/errors";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import z from "zod";
import { Col } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";

// todo 특수 에러의 경우 특수 처리
export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  // ActionErrorSchema.parse(error);

  const t = useTranslations("errors");
  const errorObject: ActionErrorT = z.string()
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

  return (
    <PageLayout className="flex items-center justify-center">
      <Col className="gap-14">
        <Col className="gap-8 items-center">
          {errorObject.httpCode > 0
          && <h1 className="text-6xl text-red font-bold text-center">
            {errorObject.httpCode} ERROR
          </h1>
          }
          <Col className="gap-4 items-center">
            <p className="text-base font-bold">{errorObject.title}</p>
            <p className="text-sm text-gray-text">{errorObject.message}</p>
          </Col>
        </Col>
        <Button asChild className="border border-white rounded-full
        bg-transparent text-white hover:bg-white hover:text-black">
          <Link href="/">
            {t("backToHome")}
          </Link>
        </Button>
      </Col>
    </PageLayout>
  );
}