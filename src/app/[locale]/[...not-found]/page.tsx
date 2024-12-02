import ErrorPage from "@/components/shared/ErrorPage";
import { ActionErrorT, NotFoundError } from "@/handlers/errors";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("errors");
  const actionError: ActionErrorT = {
    httpCode: 404,
    name: NotFoundError.name,
    title: t("NotFoundError.title"),
    message: t("NotFoundError.message"),
  };
  return <ErrorPage actionError={actionError}/>;
}