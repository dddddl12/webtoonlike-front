import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { createBidRequestMessage } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { changeBidRequestStatus, SimpleBidRequestT } from "@/resources/bidRequests/bidRequest.service";
import { BidRequestStatus } from "@/resources/bidRequests/bidRequest.types";
import { useToast } from "@/shadcn/hooks/use-toast";

export default function Controls({ bidRequestId, setReloadMessages, setCurBidRequest }: {
  bidRequestId: number;
  setReloadMessages: Dispatch<SetStateAction<boolean>>;
  setCurBidRequest: Dispatch<SetStateAction<SimpleBidRequestT>>;
}) {
  const { toast } = useToast();
  return <Row className="gap-20 mx-auto mb-10" >
    <Button variant="red" onClick={async () => {
      const updatedRequest = await changeBidRequestStatus(bidRequestId, BidRequestStatus.Declined);
      setCurBidRequest(prev => ({
        ...prev,
        status: updatedRequest.status,
        decidedAt: updatedRequest.decidedAt,
      }));
      toast({
        description: "오퍼를 거절했습니다."
      });
    }}>
      거절하기
    </Button>
    <SendMessage bidRequestId={bidRequestId}
      setReloadMessages={setReloadMessages} />
    <Button variant="mint" onClick={async () => {
      const updatedRequest = await changeBidRequestStatus(bidRequestId, BidRequestStatus.Accepted);
      setCurBidRequest(prev => ({
        ...prev,
        status: updatedRequest.status,
        decidedAt: updatedRequest.decidedAt,
      }));
      toast({
        description: "오퍼를 수락했습니다."
      });
    }}>
      수락하기
    </Button>
  </Row>;
}

function SendMessage({ bidRequestId, setReloadMessages }: {
  bidRequestId: number;
  setReloadMessages: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!editorOpen) {
      setMessage("");
    }
  }, [editorOpen]);

  const handleSubmit = async () => {
    if (!message) {
      return;
    }
    await createBidRequestMessage(bidRequestId, message);
    toast({
      description: "메시지를 전송했습니다."
    });
    setReloadMessages(true);
    setEditorOpen(false);
  };

  return <Dialog
    open={editorOpen}
    onOpenChange={setEditorOpen}
  >
    <DialogTrigger asChild>
      <Button variant="gray">
        협의 요청
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>메시지 보내기</DialogTitle>
      </DialogHeader>
      <Col>

        <Row className="w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 작성하세요."
          />
        </Row>

        <Gap y={4} />

        <Row className="justify-end">
          <Button
            className="bg-red"
            onClick={() => setEditorOpen(false)}
          >
            취소
          </Button>
          <Gap x={2} />
          <Button
            className="bg-mint"
            onClick={handleSubmit}
            disabled={!message}
          >
            전송
          </Button>
        </Row>
      </Col>


    </DialogContent>
  </Dialog>;

}