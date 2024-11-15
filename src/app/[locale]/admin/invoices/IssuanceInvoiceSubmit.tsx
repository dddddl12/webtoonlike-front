import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Row } from "@/shadcn/ui/layouts";
import { useToast } from "@/shadcn/hooks/use-toast";
import { previewOrCreateInvoice } from "@/resources/invoices/invoice.service";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function IssuanceInvoiceSubmit({
  bidRequestId, reloadPage
}: {
  bidRequestId: number;
  reloadPage: () => void;
}) {
  const { toast } = useToast();
  const [checkInvoiceOpen, setCheckInvoiceOpen] = useState<boolean>(false);

  async function handleSubmit(): Promise<void> {
    await previewOrCreateInvoice(bidRequestId, true);
    toast({
      description: "인보이스가 발행되었습니다."
    });
    setCheckInvoiceOpen(false);
    reloadPage();
  }

  return (
    <Dialog
      open={checkInvoiceOpen}
      onOpenChange={setCheckInvoiceOpen}
    >
      <DialogTrigger asChild>
        <Button variant="mint">
          발행
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[800px] h-[85%] flex flex-col gap-10">
        <VisuallyHidden>
          <DialogTitle/>
          <DialogDescription/>
        </VisuallyHidden>
        <Row className="flex-1 pt-5">
          <Previewer bidRequestId={bidRequestId} />
        </Row>
        <DialogFooter className="justify-end gap-2">
          <DialogClose asChild>
            <Button variant="red">
              취소
            </Button>
          </DialogClose>
          <Button
            variant="mint"
            onClick={handleSubmit}>
            인보이스 발행
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Previewer({ bidRequestId }: {
  bidRequestId: number;
}) {
  const [previewContent, setPreviewContent] = useState<string>();

  useEffect(() => {
    previewOrCreateInvoice(bidRequestId, false)
      .then(setPreviewContent);
  }, [bidRequestId]);

  if (!previewContent) {
    return <Spinner/>;
  }
  return <iframe
    srcDoc={previewContent}
    sandbox="allow-same-origin"
    className="bg-white w-full h-full"
  />;
}
