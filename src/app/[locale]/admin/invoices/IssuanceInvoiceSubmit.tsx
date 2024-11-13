import Spinner from "@/components/Spinner";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { useToast } from "@/shadcn/hooks/use-toast";
import { previewOrCreateInvoice } from "@/resources/invoices/invoice.service";
import { useRouter } from "@/i18n/routing";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function IssuanceInvoiceSubmit({
  bidRequestId
}: {
  bidRequestId: number;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [checkInvoiceOpen, setCheckInvoiceOpen] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<string>("");

  function handleOpenChange(open: boolean): void {
    setCheckInvoiceOpen(open);
  }

  async function handlePreview() {
    await previewOrCreateInvoice(bidRequestId, false)
      .then(setPreviewContent);
  }

  async function handleSubmit(): Promise<void> {
    await previewOrCreateInvoice(bidRequestId, true);
    toast({
      description: "인보이스가 발행되었습니다."
    });
    router.refresh();
  }

  return (
    <Dialog
      open={checkInvoiceOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button variant="mint" className="text-white" onClick={handlePreview}>
          발행
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white h-[90%]">
        <VisuallyHidden>
          <DialogTitle/>
        </VisuallyHidden>
        {!previewContent
          ? <Row className="justify-center items-center">
            <Spinner />
          </Row>
          : <Col className="w-full">
            {/*<embed src={base64dataSource} width="100%" height="90%"/>*/}
            <iframe width="100%" height="90%"
              srcDoc={previewContent}
              sandbox="allow-same-origin"
            />
            <Row className="justify-end h-[10%]">
              <Button
                variant="red"
                onClick={() => setCheckInvoiceOpen(false)}
              >
                취소
              </Button>
              <Gap x={2}/>
              <Button
                variant="mint"
                onClick={handleSubmit}>
                인보이스 발행
              </Button>
            </Row>
          </Col>
        }
      </DialogContent>
    </Dialog>
  );
}