import Spinner from "@/components/Spinner";
import { useEffect, useMemo, useState } from "react";
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { createInvoice, previewInvoice } from "@/resources/invoices/invoice.service";
import { useAction } from "next-safe-action/hooks";
import { clientErrorHandler } from "@/handlers/clientErrorHandler";

export function IssuanceInvoiceSubmit({
  bidRequestId, reloadPage
}: {
  bidRequestId: number;
  reloadPage: () => void;
}) {
  const { toast } = useToast();
  const [checkInvoiceOpen, setCheckInvoiceOpen] = useState<boolean>(false);
  const { execute } = useAction(createInvoice.bind(null, bidRequestId), {
    onSuccess: () => {
      toast({
        description: "인보이스가 발행되었습니다."
      });
      setCheckInvoiceOpen(false);
      reloadPage();
    },
    onError: clientErrorHandler
  });

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
            onClick={() => execute()}>
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
  const boundPreviewInvoice = useMemo(() => previewInvoice.bind(null, bidRequestId), [bidRequestId]);
  const { execute } = useAction(boundPreviewInvoice, {
    onSuccess: ({ data }) => {
      setPreviewContent(data);
    },
    onError: clientErrorHandler
  });

  useEffect(() => {
    execute();
  }, [execute]);

  if (!previewContent) {
    return <Spinner/>;
  }
  return <iframe
    srcDoc={previewContent}
    sandbox="allow-same-origin"
    className="bg-white w-full h-full"
  />;
}
