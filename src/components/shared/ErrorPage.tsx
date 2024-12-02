import { Col } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { Link } from "@/i18n/routing";
import PageLayout from "@/components/ui/PageLayout";
import { ActionErrorT } from "@/handlers/errors";
import { useTranslations } from "next-intl";

export default function ErrorPage({ actionError }:{
  actionError: ActionErrorT;
}) {
  const t = useTranslations("errors");
  return <PageLayout className="flex items-center justify-center">
    <Col className="gap-14">
      <Col className="gap-8 items-center">
        {actionError.httpCode > 0
          && <h1 className="text-6xl text-red font-bold text-center">
            {actionError.httpCode} ERROR
          </h1>
        }
        <Col className="gap-4 items-center">
          <p className="text-base font-bold">{actionError.title}</p>
          <p className="text-sm text-muted-foreground">{actionError.message}</p>
        </Col>
      </Col>
      <Button asChild className="rounded-full" variant="outline">
        <Link href="/">
          {t("backToHome")}
        </Link>
      </Button>
    </Col>
  </PageLayout>;
}