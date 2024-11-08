import { Gap, Row } from "@/components/ui/layouts";
import { Heading } from "@/components/ui/texts";
import PageLayout from "@/components/PageLayout";
import { getTranslations } from "next-intl/server";
import { BuyerBidRequestList } from "@/app/[locale]/buyer/bid-round-requests/BuyerBidRequestList";
import { listBidRounds } from "@/resources/bidRounds/bidRound.service";

const OFFER_TABLE_HEADER = [
  { ko: "No.", en: "No." },
  { ko: "일자", en: "Date" },
  { ko: "협의 내용", en: "Negotiation content" },
  { ko: "", en: "" },
];

export default async function BidRoundRequests() {

  const t = await getTranslations("offerPage");
  const { items: bidRounds } = await listBidRounds();

  return (
    <PageLayout>
      <Heading className="font-bold text-[26pt]">{t("offerStatus")}</Heading>
      <Gap y={10} />
      <Row className="justify-between w-full">
        <Row className="w-[30%] items-center justify-start">
          {t("titleOfSeries")}
        </Row>
        <Row className="w-[60%] justify-between">
          <Row className="w-full items-center justify-center">
            {t("registrationDate")}
          </Row>
          <Row className="w-full items-center justify-center">
            {t("viewNegotiationHistory")}
          </Row>
          <Row className="w-full items-center justify-center">
            {t("situation")}
          </Row>
        </Row>
      </Row>
      <Gap y={4} />
      <BuyerBidRequestList bidRequests={bidRounds} />
    </PageLayout>
  );
}
