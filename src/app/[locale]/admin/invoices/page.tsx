"use client";
import { Heading2 } from "@/components/ui/common";
import UninvoicedOffersList from "@/app/[locale]/admin/invoices/UninvoicedOffersList";
import InvoicedOffersList from "@/app/[locale]/admin/invoices/InvoicedOffersList";
import useReload from "@/hooks/reload";

export default function Invoice() {
  const { reload, reloadKey } = useReload();
  return <div key={reloadKey}>
    <Heading2>인보이스 발행</Heading2>
    <UninvoicedOffersList reload={reload}/>
    <Heading2>인보이스 관리</Heading2>
    <InvoicedOffersList/>
  </div>;
}