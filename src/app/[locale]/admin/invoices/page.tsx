"use client";
import { Col } from "@/components/ui/common";
import UninvoicedOffersList from "@/app/[locale]/admin/invoices/UninvoicedOffersList";
import InvoicedOffersList from "@/app/[locale]/admin/invoices/InvoicedOffersList";
import useReload from "@/hooks/reload";

export default function Invoice() {
  const { reload, reloadKey } = useReload();
  return <Col className="gap-10" key={reloadKey}>
    <Col>
      <p className="font-bold text-[18pt]">인보이스 발행</p>
      <UninvoicedOffersList reload={reload}/>
    </Col>
    <Col>
      <p className="font-bold text-[18pt]">인보이스 관리</p>
      <InvoicedOffersList/>
    </Col>
  </Col>;
}