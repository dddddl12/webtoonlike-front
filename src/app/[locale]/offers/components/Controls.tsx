import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Text } from "@/shadcn/ui/texts";
import { Textarea } from "@/shadcn/ui/textarea";
import { createBidRequestMessage } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import { useState } from "react";
import { acceptBidRequest, declineBidRequest } from "@/resources/bidRequests/bidRequest.service";

export default function Controls({ bidRequestId }: {
  bidRequestId: number;
}) {
  const [disabled, setDisabled] = useState<boolean>(false);
  return <Row className="gap-20 mx-auto mb-10" >
    <Button variant="red" onClick={() => {
      declineBidRequest(bidRequestId);
      setDisabled(true);
    }}
    disabled={disabled}>
      거절하기
    </Button>
    <SendMessage bidRequestId={bidRequestId} disabled={disabled} />
    <Button variant="mint" onClick={() => {
      acceptBidRequest(bidRequestId);
      setDisabled(true);
    }}
    disabled={disabled}>
      수락하기
    </Button>
  </Row>;
}

function SendMessage({ bidRequestId, disabled }: {
  bidRequestId: number;
  disabled: boolean;
}) {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [adminNote, setAdminNote] = useState<string>("");


  const handleSubmit = async () => {
    if (!adminNote) {
      return;
    }
    await createBidRequestMessage(bidRequestId, adminNote);
    setEditorOpen(false);
  };

  return <Dialog
    open={editorOpen}
    onOpenChange={setEditorOpen}
  >
    <DialogTrigger asChild>
      <Button variant="gray" disabled={disabled}>
      협의 요청
      </Button>
    </DialogTrigger>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>메시지를 작성하세요.</DialogTitle>
      </DialogHeader>
      <Col>

        <Row className="w-[70%]">
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
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
          >
                전송
          </Button>
        </Row>
      </Col>


    </DialogContent>
  </Dialog>;

}