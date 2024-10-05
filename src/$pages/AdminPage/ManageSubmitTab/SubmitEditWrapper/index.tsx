"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { enUS, ko } from "date-fns/locale";
import { format } from "date-fns";


import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/ui/shadcn/Dialog";
import { Input } from "@/ui/shadcn/Input";
import { Button } from "@/ui/shadcn/Button";
import { Col, Gap, Row } from "@/ui/layouts";
import * as BidRoundApi from "@/apis/bid_rounds";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BidRoundT } from "@/types";
import { Text } from "@/ui/texts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/ui/shadcn/Select";
import { Calendar } from "@/ui/shadcn/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/Popover";
import { convertBidRoundStatus } from "@/utils/bidRoundStatusConverter";
import { checkBidRoundValidity } from "./utils";

type BidRequestEditWrapperProps = {
  bidRound: BidRoundT
  children: ReactNode
  onEditSuccess: (bidRound: BidRoundT) => void
}

export function SubmitEditWrapper({
  bidRound,
  children,
  onEditSuccess
}: BidRequestEditWrapperProps): JSX.Element{
  const nowLocale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const [roundStatus, setRoundStatus] = useState<BidRoundT["status"]>("idle");
  const [bidStartAt, setBidStartAt] = useState<Date>();
  const [negoStartAt, setNegoStartAt] = useState<Date>();
  const [processEndAt, setProcessEndAt] = useState<Date>();
  const [adminMemo, setAdminMemo] = useState<string>("");

  useEffect(() => {
    if (!bidRound) return;
    setRoundStatus(bidRound.status);
    setBidStartAt(bidRound.bidStartAt ? new Date(bidRound.bidStartAt) : new Date());
    setNegoStartAt(bidRound.negoStartAt ? new Date(bidRound.negoStartAt) : new Date());
    setProcessEndAt(bidRound.processEndAt ? new Date(bidRound.processEndAt) : new Date());
    setAdminMemo(bidRound.adminMemo || "");
  }, []);

  function handleOpenChange(open: boolean): void {
    setEditorOpen(open);
  }

  async function handleSubmit(): Promise<void> {

    try {
      const round: BidRoundT = {
        ...bidRound,
        bidStartAt,
        negoStartAt,
        processEndAt,
        status: roundStatus,
      };
      checkBidRoundValidity(round);
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
      return;
    }

    try {
      const updated = await BidRoundApi.update(bidRound.id, {
        bidStartAt,
        negoStartAt,
        adminMemo,
        processEndAt,
        status: roundStatus,
      });
      const { data: newUpdated } = await BidRoundApi.get(updated.id, { $webtoon: true });
      onEditSuccess(newUpdated);

      enqueueSnackbar("투고 수정에 성공했습니다.", { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar("투고 수정에 실패했습니다.", { variant: "error" });
    }
  }

  return (
    <>
      <Dialog
        open={editorOpen}
        onOpenChange={handleOpenChange}
      >
        <DialogTrigger>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-white">
          <Col>

            <Row>
              <Text className="min-w-[100px]">게시 시작일</Text>
              <Popover>
                <PopoverTrigger className="w-[70%]">
                  <Input value={`${format(bidStartAt ? bidStartAt : new Date, "yyyy.MM.dd")}`} />
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={bidStartAt}
                    onSelect={setBidStartAt}
                    locale={nowLocale === "ko" ? ko : enUS}
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
                  <Input value={`${format(negoStartAt ? negoStartAt : new Date, "yyyy.MM.dd")}`} />
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={negoStartAt}
                    onSelect={setNegoStartAt}
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
                  <Input value={`${format(processEndAt ? processEndAt : new Date, "yyyy.MM.dd")}`} />
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={processEndAt}
                    onSelect={setProcessEndAt}
                    locale={nowLocale === "ko" ? ko : enUS}
                  />
                </PopoverContent>
              </Popover>
            </Row>

            <Gap y={4} />

            <Row>
              <Text className="min-w-[100px]">상태</Text>
              <Row className="w-[70%]">
                <Select onValueChange={(value) => { setRoundStatus(value as BidRoundT["status"]); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={`${bidRound.status ? convertBidRoundStatus(bidRound.status) : "상태 변경"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* <SelectItem value="idle">거래등록 가능</SelectItem> */}
                      {/* now 이후는 선택할 수 없다 */}
                      <SelectItem value="waiting">노출 대기</SelectItem>
                      {/* now 이후는 선택할 수 없다 */}
                      <SelectItem value="bidding">노출 중</SelectItem>
                      {/* now 앞뒤로 시작 및 종료일이 선택이 되어야 함. */}
                      {/* <SelectItem value="negotiating">협상 중</SelectItem>
                      항상 bidStartAt 보다 negoStartAt이 커야한다. */}
                      <SelectItem value="done">노출 종료</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Row>
            </Row>

            <Gap y={4} />

            <Row>
              <Text className="min-w-[100px]">관리자 메모</Text>
              <Row className="w-[70%]">
                <Input
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
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
    </>
  );
}