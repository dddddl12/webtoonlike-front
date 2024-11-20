import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { createBidRequestMessage } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  changeBidRequestStatus,
  getSimpleBidRequest,
  SimpleBidRequestT
} from "@/resources/bidRequests/bidRequest.service";
import { BidRequestStatus } from "@/resources/bidRequests/bidRequest.types";
import { useToast } from "@/shadcn/hooks/use-toast";
import { UserTypeT } from "@/resources/users/user.types";
import useTokenInfo from "@/hooks/tokenInfo";
import useSafeAction from "@/hooks/safeAction";

export default function Controls({ bidRequestId, setReloadMessages, setCurBidRequest, whoCanDecideAtThisTurn, refMessageId }: {
  bidRequestId: number;
  setReloadMessages: Dispatch<SetStateAction<boolean>>;
  setCurBidRequest: Dispatch<SetStateAction<SimpleBidRequestT>>;
  whoCanDecideAtThisTurn: UserTypeT;
  refMessageId?: number;
}) {
  const { toast } = useToast();
  const { tokenInfo } = useTokenInfo();
  const boundChangeBidRequestStatus = useMemo(() => changeBidRequestStatus
    .bind(null, bidRequestId), [bidRequestId]);
  const { execute } = useSafeAction(boundChangeBidRequestStatus, {
    onSuccess: ({ data }) => {
      if (!data) {
        throw new Error("data is null");
      }
      setCurBidRequest(data);
      toast({
        description: data.status === BidRequestStatus.Accepted
          ? "오퍼를 수락했습니다."
          : "오퍼를 거절했습니다."
      });
    },
    onError: () => {
      executeOnFailure();
    }
  });

  // 오퍼 실패 시 업데이트
  const boundGetSimpleBidRequest = useMemo(() => getSimpleBidRequest
    .bind(null, bidRequestId), [bidRequestId]);
  const { execute: executeOnFailure } = useSafeAction(boundGetSimpleBidRequest, {
    onSuccess: ({ data }) => {
      if (!data) {
        throw new Error("data is null");
      }
      setCurBidRequest(data);
    }
  });

  return <Row className="gap-20 mx-auto mb-10" >
    {tokenInfo?.metadata.type === whoCanDecideAtThisTurn
      && <Button variant="red" onClick={() => execute({
        changeTo: BidRequestStatus.Declined,
        refMessageId
      })}>
        거절하기
      </Button>}
    <SendMessage bidRequestId={bidRequestId}
      setReloadMessages={setReloadMessages} />
    {tokenInfo?.metadata.type === whoCanDecideAtThisTurn
      && <Button variant="mint" onClick={() => execute({
        changeTo: BidRequestStatus.Accepted,
        refMessageId
      })}>
        수락하기
      </Button>}
  </Row>;
}

function SendMessage({ bidRequestId, setReloadMessages }: {
  bidRequestId: number;
  setReloadMessages: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const boundCreateBidRequestMessage = useMemo(() => createBidRequestMessage
    .bind(null, bidRequestId), [bidRequestId]);
  const { execute } = useSafeAction(boundCreateBidRequestMessage, {
    onSuccess: () => {
      toast({
        description: "메시지를 전송했습니다."
      });
      setReloadMessages(true);
      setEditorOpen(false);
    }
  });

  useEffect(() => {
    if (!editorOpen) {
      setMessage("");
    }
  }, [editorOpen]);

  const handleSubmit = async () => {
    if (!message) {
      return;
    }
    execute({ content: message });
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