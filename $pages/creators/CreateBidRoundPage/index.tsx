import { Container, Gap } from "@/ui/layouts";
import { Heading } from "@/ui/texts";
import { CreateBidRoundForm } from "./CreateBidRoundForm";
import { useTranslations } from "next-intl";
import type { WebtoonT } from "@backend/types/Webtoon";

type CreateBidRoundPageProps = {
  webtoon: WebtoonT
}

export function CreateBidRoundPage({ webtoon } : CreateBidRoundPageProps ) {
  const t = useTranslations("seriesManagement");
  return (
    <Container className="min-h-[70vh] text-white">
      <Gap y={20} />
      <Heading className="text-[24pt] font-bold">{t("registerOfContentTransactions")}</Heading>
      <Gap y={10} />
      <CreateBidRoundForm webtoon={webtoon} />
    </Container>
  );
}
