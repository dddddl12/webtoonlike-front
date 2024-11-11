import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { createBidRequestMessage } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import { Dispatch, SetStateAction, useState } from "react";
import { acceptBidRequest, declineBidRequest } from "@/resources/bidRequests/bidRequest.service";

export default function Controls({ bidRequestId, setRerender }: {
  bidRequestId: number;
  setRerender: Dispatch<React.SetStateAction<number>>;
}) {
  return <Row className="gap-20 mx-auto mb-10" >
    <Button variant="red" onClick={async () => {
      await declineBidRequest(bidRequestId);
      setRerender(prev => prev + 1);
    }}>
      거절하기
    </Button>
    <SendMessage bidRequestId={bidRequestId} setRerender={setRerender} />
    <Button variant="mint" onClick={async () => {
      await acceptBidRequest(bidRequestId);
      setRerender(prev => prev + 1);
    }}>
      수락하기
    </Button>
  </Row>;
}

function SendMessage({ bidRequestId, setRerender }: {
  bidRequestId: number;
  setRerender: Dispatch<SetStateAction<number>>;
}) {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");


  const handleSubmit = async () => {
    if (!message) {
      return;
    }
    await createBidRequestMessage(bidRequestId, message);
    setRerender(prev => prev + 1);
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
    <DialogContent className="bg-white">
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