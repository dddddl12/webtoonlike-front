"use client";
import { Col } from "@/components/ui/common";
import IssuanceInvoice from "@/app/[locale]/admin/invoices/IssuanceInvoice";
import ManageInvoice from "@/app/[locale]/admin/invoices/ManageInvoice";
import useReload from "@/hooks/reload";

export default function Invoice() {
  const { reload, reloadKey } = useReload();
  return <Col className="gap-10" key={reloadKey}>
    <Col>
      <p className="font-bold text-[18pt]">인보이스 발행</p>
      <IssuanceInvoice reload={reload}/>
    </Col>
    <Col>
      <p className="font-bold text-[18pt]">인보이스 관리</p>
      <ManageInvoice/>
    </Col>
  </Col>;
}