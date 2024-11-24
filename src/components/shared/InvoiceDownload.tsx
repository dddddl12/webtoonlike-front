import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
import Spinner from "@/components/ui/Spinner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { jsPDF } from "jspdf";
import { Row } from "@/components/ui/common";
import useSafeAction from "@/hooks/safeAction";
import { InvoiceWithWebtoonT } from "@/resources/invoices/dtos/invoice.dto";
import { downloadInvoiceContent } from "@/resources/invoices/controllers/invoiceContent.controller";

export default function InvoiceDownload({
  invoice
}: {
  invoice: InvoiceWithWebtoonT;
}) {
  const t = useTranslations("invoiceManagement");
  const tGeneral = useTranslations("general");
  const [invoiceDownloadOpen, setInvoiceDownloadOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>();

  const boundDownloadInvoiceContent = useMemo(() => downloadInvoiceContent.bind(null, invoice.id), [invoice.id]);
  const { execute } = useSafeAction(boundDownloadInvoiceContent, {
    onSuccess: ({ data }) => {
      setPreviewContent(data);
    }
  });

  useEffect(() => {
    if (invoiceDownloadOpen) {
      execute();
    }
  }, [execute, invoiceDownloadOpen]);

  return (
    <Dialog
      open={invoiceDownloadOpen}
      onOpenChange={setInvoiceDownloadOpen}
    >
      <DialogTrigger asChild>
        <Button variant="mint">
          {t("downloadInvoice")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[800px] h-[85%] flex flex-col gap-10">
        <VisuallyHidden>
          <DialogTitle/>
          <DialogDescription/>
        </VisuallyHidden>
        <Row className="flex-1 pt-5">
          {previewContent
            ? <iframe
              srcDoc={previewContent}
              sandbox="allow-same-origin"
              className="bg-white w-full h-full"
            />
            : <Spinner/>}
        </Row>
        <DialogFooter className="justify-end gap-2">
          <DialogClose asChild>
            <Button variant="red">
              {tGeneral("cancel")}
            </Button>
          </DialogClose>
          <DownloadButton previewContent={previewContent}
            invoice={invoice}/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DownloadButton({ previewContent, invoice }: {
  invoice: InvoiceWithWebtoonT;
  previewContent?: string;
}) {
  const t = useTranslations("invoiceManagement");
  return <Button
    variant="mint"
    disabled={!previewContent}
    onClick={async () => {
      if (!previewContent) {
        return;
      }
      const a = document.createElement("div");
      a.innerHTML = previewContent;
      a.style.fontFamily = "NanumGothic";
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });
      doc.addFont("/fonts/NanumGothic.ttf", "NanumGothic", "normal");
      doc.addFont("/fonts/NanumGothicBold.ttf", "NanumGothic", "bold");
      doc.setFont("NanumGothic");
      doc.html(a, {
        callback: function(doc) {
          // Save the PDF
          doc.save(`${invoice.webtoon.localized.title}_${invoice.creatorUsername}_${invoice.buyerUsername}_invoice.pdf`);
        },
        width: 180,
        windowWidth: 700,
        margin: [20, 15],
      });
    }}>
    {t("downloadInvoice")}
  </Button>;
}