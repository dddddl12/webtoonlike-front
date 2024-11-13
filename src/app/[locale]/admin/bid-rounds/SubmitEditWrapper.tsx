"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { enUS, ko } from "date-fns/locale";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { Calendar } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { AdminPageBidRoundT, editBidRoundPlan } from "@/resources/bidRounds/bidRound.service";
import { useToast } from "@/shadcn/hooks/use-toast";
import { checkBidRoundValidity } from "@/app/[locale]/admin/bid-rounds/utils";

export default function SubmitEditWrapper({
  bidRound,
}: {
  bidRound: AdminPageBidRoundT;
}) {
  const { toast } = useToast();
  const nowLocale = useLocale();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [bidStartsAt, setBidStartsAt] = useState(bidRound.bidStartsAt);
  const [negoStartsAt, setNegoStartsAt] = useState(bidRound.negoStartsAt);
  const [processEndsAt, setProcessEndsAt] = useState(bidRound.processEndsAt);
  const [adminNote, setAdminNote] = useState<string>("");


  function handleOpenChange(open: boolean): void {
    setEditorOpen(open);
  }

  async function handleSubmit(): Promise<void> {
    try {
      const dates = checkBidRoundValidity(
        { bidStartsAt, negoStartsAt, processEndsAt }
      );
      await editBidRoundPlan(bidRound.id, {
        ...dates,
        adminNote,
      });
      toast({
        description: "투고 수정에 성공했습니다.",
        // variant: "success" TODO
      });
      window.location.reload();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          description: e.message,
        });
      }
    }
  }

  return (
    <Dialog
      open={editorOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button>
          edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit dates</DialogTitle>
        </DialogHeader>
        <Col>

          <Row>
            <Text className="min-w-[100px]">게시 시작일</Text>
            <Popover>
              <PopoverTrigger className="w-[70%]">
                <div className="border rounded-sm h-10 flex items-center justify-center">
                  {bidStartsAt?.toLocaleDateString("ko")}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={bidStartsAt}
                  onSelect={setBidStartsAt}
                  locale={ko}
                  // disabled={{ after: (negoStartAt ?? new Date()), before: (roundStatus === "waiting" ? new Date() : undefined) }}
                />
              </PopoverContent>
            </Popover>
          </Row>

          <Gap y={4} />

          <Row>
            <Text className="min-w-[100px]">선공개 종료일</Text>
            <Popover>
              <PopoverTrigger className="w-[70%]">
                <div className="border rounded-sm h-10 flex items-center justify-center">
                  {negoStartsAt?.toLocaleDateString("ko")}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={negoStartsAt}
                  onSelect={setNegoStartsAt}
                  locale={nowLocale === "ko" ? ko : enUS}
                  // disabled={{ before: bidStartAt ?? new Date(), after: (roundStatus !== "bidding" ? new Date() : undefined) }}
                />
              </PopoverContent>
            </Popover>
          </Row>

          <Gap y={4} />

          <Row>
            <Text className="min-w-[100px]">게시 종료일</Text>
            <Popover>
              <PopoverTrigger className="w-[70%]">
                <div className="border rounded-sm h-10 flex items-center justify-center">
                  {processEndsAt?.toLocaleDateString("ko")}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={processEndsAt}
                  onSelect={setProcessEndsAt}
                  locale={nowLocale === "ko" ? ko : enUS}
                />
              </PopoverContent>
            </Popover>
          </Row>

          {/*TODO*/}
          {/*<Gap y={4} />*/}

          {/*<Row>*/}
          {/*  <Text className="min-w-[100px]">상태</Text>*/}
          {/*  <Row className="w-[70%]">*/}
          {/*    <Select onValueChange={(value) => { setRoundStatus(value as BidRoundT["status"]); }}>*/}
          {/*      <SelectTrigger>*/}
          {/*        <SelectValue placeholder={`${bidRound.status ? convertBidRoundStatus(bidRound.status) : "상태 변경"}`} />*/}
          {/*      </SelectTrigger>*/}
          {/*      <SelectContent>*/}
          {/*        <SelectGroup>*/}
          {/*          /!* <SelectItem value="idle">거래등록 가능</SelectItem> *!/*/}
          {/*          /!* now 이후는 선택할 수 없다 *!/*/}
          {/*          <SelectItem value="waiting">노출 대기</SelectItem>*/}
          {/*          /!* now 이후는 선택할 수 없다 *!/*/}
          {/*          <SelectItem value="bidding">노출 중</SelectItem>*/}
          {/*          /!* now 앞뒤로 시작 및 종료일이 선택이 되어야 함. *!/*/}
          {/*          /!* <SelectItem value="negotiating">협상 중</SelectItem>*/}
          {/*          항상 bidStartAt 보다 negoStartAt이 커야한다. *!/*/}
          {/*          <SelectItem value="done">노출 종료</SelectItem>*/}
          {/*        </SelectGroup>*/}
          {/*      </SelectContent>*/}
          {/*    </Select>*/}
          {/*  </Row>*/}
          {/*</Row>*/}

          <Gap y={4} />

          <Row>
            <Text className="min-w-[100px]">관리자 메모</Text>
            <Row className="w-[70%]">
              <Input
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="관리자 메모"
              />
            </Row>
          </Row>

          <Gap y={4} />

          <Row className="justify-end">
            <Button
              className="bg-red"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Gap x={2} />
            <Button
              className="bg-mint"
              onClick={handleSubmit}
            >
              적용
            </Button>
          </Row>
        </Col>


      </DialogContent>
    </Dialog>
  );
}