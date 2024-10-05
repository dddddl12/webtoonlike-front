import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/shadcn/Dialog";
import { Button } from "@/ui/shadcn/Button";
import { Col, Gap, Row } from "@/ui/layouts";
import { downloadAsPDF } from "@/utils/downloadAsPDF";
import { InvoiceT } from "@/types";

type IssuanceInvoiceSubmitProps = {
  invoice: InvoiceT;
};

export function PreviewInvoiceAdmin({
  invoice
}: IssuanceInvoiceSubmitProps): JSX.Element {
  const [checkInvoiceOpen, setCheckInvoiceOpen] = useState<boolean>(false);

  useEffect(() => {
    if(!invoice) return;
  }, []);

  function handleOpenChange(open: boolean): void {
    setCheckInvoiceOpen(open);
  }


  return (
    <Dialog
      open={checkInvoiceOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger>
        <Button className="w-[80px] h-[30px] p-0 bg-mint">
          다운로드
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white h-[90%]">
        <Col className="w-full">
          <embed src={invoice?.dataUri} width="100%" height="90%"/>
          <Row className="justify-end h-[10%]">
            <Button
              className="bg-red"
              onClick={() => setCheckInvoiceOpen(false)}
            >
              취소
            </Button>
            <Gap x={2} />
            <Button
              className="bg-mint"
              onClick={() => {
                downloadAsPDF(
                  invoice.dataUri,
                  `${invoice.webtoon?.title}_${invoice.creator?.name}_${invoice.buyer?.name}_invoice`);
              }}>
              다운로드
            </Button>
          </Row>
        </Col>
      </DialogContent>
    </Dialog>
  );
}
