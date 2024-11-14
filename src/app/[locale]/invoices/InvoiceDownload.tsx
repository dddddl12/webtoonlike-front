import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { downloadInvoiceContent } from "@/resources/invoices/invoice.service";
import Spinner from "@/components/Spinner";
import { InvoiceExtendedT } from "@/resources/invoices/invoice.types";
import { displayName } from "@/utils/displayName";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { jsPDF } from "jspdf";
import { Col } from "@/shadcn/ui/layouts";

export default function InvoiceDownload({
  invoice
}: {
  invoice: InvoiceExtendedT;
}) {
  const t = useTranslations("invoiceManagement");
  const [invoiceDownloadOpen, setInvoiceDownloadOpen] = useState(false);

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
      <DialogContent className="h-[90%] max-w-3xl">
        <VisuallyHidden>
          <DialogTitle/>
        </VisuallyHidden>
        <DialogContentBody
          invoice={invoice}
          closeDialog={() => setInvoiceDownloadOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function DialogContentBody({
  invoice, closeDialog
}: {
  invoice: InvoiceExtendedT;
  closeDialog: () => void;
}) {
  const [previewContent, setPreviewContent] = useState<string>("");

  useEffect(() => {
    // fetch(`/api/invoices/${invoice.id}`)
    downloadInvoiceContent(invoice.id)
      .then(setPreviewContent);
  }, [invoice.id]);

  const locale = useLocale();
  const t = useTranslations("invoiceManagement");
  const tGeneral = useTranslations("general");

  if (!previewContent) {
    return <Spinner/>;
  }
  return <Col className="w-full">
    <iframe width="100%" height="90%"
      srcDoc={previewContent}
      sandbox="allow-same-origin"
      className="bg-white"
    />
    <DialogFooter className="justify-end gap-2 mt-10">
      <Button
        variant="red"
        onClick={closeDialog}
      >
        {tGeneral("cancel")}
      </Button>
      <Button
        variant="mint"
        onClick={async () => {
          const html = await downloadInvoiceContent(invoice.id);
          const a = document.createElement("div");
          a.innerHTML = html;
          a.style.color = "black";
          const doc = new jsPDF();
          doc.html(a, {
            callback: function(doc) {
              // Save the PDF
              doc.save(`${displayName(locale, invoice.webtoon.title, invoice.webtoon.title_en)}_${invoice.creatorUsername}_${invoice.buyerUsername}_invoice.pdf`);
            },
            x: 15,
            y: 15,
            width: 170, //target width in the PDF document
            windowWidth: 650 //window width in CSS pixels
          });
        }}>
        {t("downloadInvoice")} (한글 인코딩 이슈 해결 중...)
      </Button>
    </DialogFooter>
  </Col>;
}
