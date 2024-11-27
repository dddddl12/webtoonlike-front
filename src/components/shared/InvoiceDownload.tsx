import { useEffect, useState } from "react";
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
import { InvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import { downloadInvoiceContent } from "@/resources/invoices/controllers/invoiceContent.controller";

export default function InvoiceDownload({
  offer
}: {
  offer: InvoicedOfferT;
}) {
  const t = useTranslations("invoiceManagement");
  const tGeneral = useTranslations("general");
  const [invoiceDownloadOpen, setInvoiceDownloadOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>();

  useEffect(() => {
    if (!invoiceDownloadOpen) {
      return;
    }
    downloadInvoiceContent(offer.invoice.id)
      .then(res => setPreviewContent(res?.data));
  }, [offer.invoice.id, invoiceDownloadOpen]);

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
            offer={offer}/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DownloadButton({ previewContent, offer }: {
  offer: InvoicedOfferT;
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
          doc.save(`${offer.webtoon.localized.title}_${offer.creator.user.name}_${offer.buyer.user.name}_invoice.pdf`);
        },
        width: 180,
        windowWidth: 700,
        margin: [20, 15],
      });
    }}>
    {t("downloadInvoice")}
  </Button>;
}