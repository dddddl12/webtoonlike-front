import { useEffect, useState } from "react";
import { downloadAsPDF } from "@/resources/invoices/downloadAsPDF";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { downloadInvoiceContent } from "@/resources/invoices/invoice.service";
import Spinner from "@/components/Spinner";
import { InvoiceExtendedT } from "@/resources/invoices/invoice.types";
import { displayName } from "@/utils/displayName";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
      <DialogContent>
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
  const [invoiceContentUrl, setInvoiceContentUrl] = useState<string>();

  useEffect(() => {
    // fetch(`/api/invoices/${invoice.id}`)
    downloadInvoiceContent(invoice.id)
      .then(async (uint8Array) => {
        const blob = new Blob([uint8Array], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setInvoiceContentUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [invoice.id]);

  const locale = useLocale();
  const t = useTranslations("invoiceManagement");
  const tGeneral = useTranslations("general");

  if (!invoiceContentUrl) {
    return <Spinner/>;
  }
  return <>
    <embed src={invoiceContentUrl} width="100%" height="500px"/>
    <DialogFooter className="justify-end gap-2">
      <Button
        variant="red"
        onClick={closeDialog}
      >
        {tGeneral("cancel")}
      </Button>
      <Button
        variant="mint"
        onClick={() => {
          downloadAsPDF(
            invoiceContentUrl,
            `${displayName(locale, invoice.webtoon.title, invoice.webtoon.title_en)}_${invoice.creatorUsername}_${invoice.buyerUsername}_invoice`);
        }}>
        {t("downloadInvoice")}
      </Button>
    </DialogFooter>
  </>;
}
