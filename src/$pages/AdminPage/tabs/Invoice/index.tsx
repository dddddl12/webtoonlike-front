import { Col, Container, Gap } from "@/ui/layouts";
import { IssuanceInvoice } from "./IssuanceInvoice";
import { ManageInvoice } from "./ManageInvoice";

export function Invoice() {
  return (
    <Container className="p-0">
      <Col>
        <IssuanceInvoice />
        <Gap y={10} />
        <ManageInvoice />
      </Col>
      <Gap y={40} />
    </Container>
  );
}
