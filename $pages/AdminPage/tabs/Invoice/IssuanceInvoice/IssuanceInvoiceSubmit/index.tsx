import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/shadcn/Dialog";
import Image from "next/image";
import { Button } from "@/ui/shadcn/Button";
import { Col, Gap, Row } from "@/ui/layouts";
import Spinner from "@/components/Spinner";

type IssuanceInvoiceSubmitProps = {
  requestId: number;
};

export function IssuanceInvoiceSubmit({
  requestId
}: IssuanceInvoiceSubmitProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [checkInvoiceOpen, setCheckInvoiceOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [base64dataSource, setBase64dataSource] = useState<string>("");

  function handleOpenChange(open: boolean): void {
    setCheckInvoiceOpen(open);
  }

  async function handlePublishInvoice(bidRequestId: number) {
    setIsPublishing(true);
    try {
      const rsp = await BidRequestApi.publishInvoice(bidRequestId);
      setBase64dataSource(rsp.base64data);
      setIsPublishing(false);
    } catch (e) {
      console.warn(e);
      setIsPublishing(false);
      enqueueSnackbar("인보이스 미리보기에 실패했습니다", { variant: "error" });
    }
  }

  async function handleSubmit(): Promise<void> {
    try {
      if(!base64dataSource) throw new Error("인보이스 발행에 실패했습니다.");
      await BidRequestApi.confirmInvoice(requestId, base64dataSource);
      enqueueSnackbar("인보이스가 발행되었습니다.", { variant: "success" });
      window.location.reload();
    } catch (e) {
      console.log(e);
      enqueueSnackbar("인보이스 발행에 실패했습니다.", { variant: "error" });
    }
  }

  return (
    <Dialog
      open={checkInvoiceOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger>
        <Button className="w-[80px] h-[30px] p-0 bg-mint" onClick={() => {
          handlePublishInvoice(requestId);
        }}>
          발행
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white h-[90%]">
        {isPublishing ?
          <Row className="justify-center items-center">
            <Spinner />
          </Row> :
          <Col className="w-full">
            <embed src={base64dataSource} width="100%" height="90%"/>
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
