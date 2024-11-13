import { Col } from "@/shadcn/ui/layouts";
import IssuanceInvoice from "@/app/[locale]/admin/invoices/IssuanceInvoice";
import ManageInvoice from "@/app/[locale]/admin/invoices/ManageInvoice";

export default function Invoice() {
  return (
    <Col className="gap-10">
      <Col>
        <p className="font-bold text-[18pt]">인보이스 발행</p>
        <IssuanceInvoice />
      </Col>
      <Col>
        <p className="font-bold text-[18pt]">인보이스 관리</p>
        <ManageInvoice />
      </Col>

    </Col>
  );
}