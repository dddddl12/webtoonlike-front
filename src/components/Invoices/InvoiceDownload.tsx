import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { downloadInvoiceContent } from "@/resources/invoices/invoice.service";
import Spinner from "@/components/Spinner";
import { InvoiceExtendedT } from "@/resources/invoices/invoice.types";
import { displayName } from "@/utils/displayName";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { jsPDF } from "jspdf";
import { Row } from "@/shadcn/ui/layouts";

export default function InvoiceDownload({
  invoice
}: {
  invoice: InvoiceExtendedT;
}) {
  const t = useTranslations("invoiceManagement");
  const tGeneral = useTranslations("general");
  const locale = useLocale();
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
      <DialogContent className="max-w-3xl max-h-[800px] h-[85%] flex flex-col gap-10">
        <VisuallyHidden>
          <DialogTitle/>
          <DialogDescription/>
        </VisuallyHidden>
        <Row className="flex-1 pt-5">
          <Previewer invoiceId={invoice.id} />
        </Row>
        <DialogFooter className="justify-end gap-2">
          <DialogClose asChild>
            <Button variant="red">
              {tGeneral("cancel")}
            </Button>
          </DialogClose>
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
      </DialogContent>
    </Dialog>
  );
}

function Previewer({ invoiceId }: {
  invoiceId: number;
}) {
  const [previewContent, setPreviewContent] = useState<string>();

  useEffect(() => {
    downloadInvoiceContent(invoiceId)
      .then(setPreviewContent);
  }, [invoiceId]);

  if (!previewContent) {
    return <Spinner/>;
  }
  return <iframe
    srcDoc={previewContent}
    sandbox="allow-same-origin"
    className="bg-white w-full h-full"
  />;
}
