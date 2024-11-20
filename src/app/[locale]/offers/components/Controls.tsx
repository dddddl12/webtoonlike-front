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
import { useTranslations } from "next-intl";
import { useConfirm } from "@/hooks/alert";

export default function Controls({ bidRequestId, reload, setCurBidRequest, whoCanDecideAtThisTurn, refMessageId }: {
  bidRequestId: number;
  reload: () => void;
  setCurBidRequest: Dispatch<SetStateAction<SimpleBidRequestT>>;
  whoCanDecideAtThisTurn: UserTypeT;
  refMessageId?: number;
}) {
  const { toast } = useToast();
  const { tokenInfo } = useTokenInfo();
  const t = useTranslations("offerControls");
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
          ? t("accept.toast")
          : t("decline.toast")
      });
    },
    onError: () => {
      executeOnFailure();
    }
  });

  const declineConfirm = useConfirm({
    title: t("decline.alertTitle"),
    message: t("decline.alertMessage"),
    confirmText: t("decline.confirm"),
    onConfirm: () => execute({
      changeTo: BidRequestStatus.Declined,
      refMessageId
    })
  });

  const acceptConfirm = useConfirm({
    title: t("accept.alertTitle"),
    message: t("accept.alertMessage"),
    confirmText: t("accept.confirm"),
    onConfirm: () => execute({
      changeTo: BidRequestStatus.Accepted,
      refMessageId
    })
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
      && <Button variant="red" onClick={declineConfirm.open}>
        {t("decline.actionButton")}
      </Button>}
    <SendMessage bidRequestId={bidRequestId}
      reload={reload} />
    {tokenInfo?.metadata.type === whoCanDecideAtThisTurn
      && <Button variant="mint" onClick={acceptConfirm.open}>
        {t("accept.actionButton")}
      </Button>}
  </Row>;
}

function SendMessage({ bidRequestId, reload }: {
  bidRequestId: number;
  reload: () => void;
}) {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const t = useTranslations("offerControls");
  const tGeneral = useTranslations("general");

  const boundCreateBidRequestMessage = useMemo(() => createBidRequestMessage
    .bind(null, bidRequestId), [bidRequestId]);
  const { execute } = useSafeAction(boundCreateBidRequestMessage, {
    onSuccess: () => {
      toast({
        description: t("message.toast")
      });
      reload();
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
        {t("message.actionButton")}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("message.dialogTitle")}</DialogTitle>
      </DialogHeader>
      <Col>

        <Row className="w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("message.placeholder")}
          />
        </Row>

        <Gap y={4} />

        <Row className="justify-end">
          <Button
            className="bg-red"
            onClick={() => setEditorOpen(false)}
          >
            {tGeneral("cancel")}
          </Button>
          <Gap x={2} />
          <Button
            className="bg-mint"
            onClick={handleSubmit}
            disabled={!message}
          >
            {t("message.confirm")}
          </Button>
        </Row>
      </Col>


    </DialogContent>
  </Dialog>;

}