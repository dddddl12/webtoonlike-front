"use client";
import { Col } from "@/shadcn/ui/layouts";
import IssuanceInvoice from "@/app/[locale]/admin/invoices/IssuanceInvoice";
import ManageInvoice from "@/app/[locale]/admin/invoices/ManageInvoice";
import { useEffect, useState } from "react";

export default function Invoice() {
  const [loaded, setLoaded] = useState(true);
  useEffect(() => {
    if (loaded) {
      return;
    }
    setLoaded(true);
  }, [loaded]);
  return <>{ loaded
    && <Col className="gap-10">
      <Col>
        <p className="font-bold text-[18pt]">인보이스 발행</p>
        <IssuanceInvoice reloadPage={() => setLoaded(false)}/>
      </Col>
      <Col>
        <p className="font-bold text-[18pt]">인보이스 관리</p>
        <ManageInvoice/>
      </Col>
    </Col>
  }</>;
}