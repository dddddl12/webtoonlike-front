// import { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "@/ui/shadcn/Dialog";
// import { Button } from "@/ui/shadcn/Button";
// import { Col, Gap, Row } from "@/ui/layouts";
// import { downloadAsPDF } from "@/utils/downloadAsPDF";
// import { useLocale } from "next-intl";
// import type { InvoiceT } from "@backend/types/Invoice";
//
// type IssuanceInvoiceSubmitProps = {
//   invoice: InvoiceT;
// };
//
// export function PreviewInvoiceUser({
//   invoice
// }: IssuanceInvoiceSubmitProps): JSX.Element {
//   const locale = useLocale();
//   const [checkInvoiceOpen, setCheckInvoiceOpen] = useState<boolean>(false);
//
//   useEffect(() => {
//     if(!invoice) return;
//   }, []);
//
//   function handleOpenChange(open: boolean): void {
//     setCheckInvoiceOpen(open);
//   }
//
//
//   return (
//     <Dialog
//       open={checkInvoiceOpen}
//       onOpenChange={handleOpenChange}
//     >
//       <DialogTrigger>
//         <Button className="w-[80px] h-[30px] p-0 bg-mint">
//           {locale === "ko" ? "다운로드" : "Download"}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="bg-white h-[90%]">
//         <Col className="w-full">
//           <embed src={invoice?.dataUri} width="100%" height="90%"/>
//           <Row className="justify-end h-[10%]">
//             <Button
//               className="bg-red"
//               onClick={() => setCheckInvoiceOpen(false)}
//             >
//               {locale === "ko" ? "취소" : "Close"}
//             </Button>
//             <Gap x={2} />
//             <Button
//               className="bg-mint"
//               onClick={() => {
//                 downloadAsPDF(
//                   invoice.dataUri,
//                   `${locale === "ko" ?
//                     invoice.webtoon?.title :
//                     invoice.webtoon?.title_en ??
//                   invoice.webtoon?.title}_${invoice.creator?.name}_${invoice.buyer?.name}_invoice`);
//               }}>
//               {locale === "ko" ? "다운로드" : "Download"}
//             </Button>
//           </Row>
//         </Col>
//       </DialogContent>
//     </Dialog>
//   );
// }
