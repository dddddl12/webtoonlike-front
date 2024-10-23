"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { ErrorComponent } from "@/components/ErrorComponent";
import Spinner from "@/components/Spinner";
import { useAlertDialog } from "@/hooks/ConfirmDialog";
import { useListData } from "@/hooks/ListData";
import { useSnackbar } from "notistack";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/ui/shadcn/Table";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { Text } from "@/ui/texts";
import { businessFieldConverterToEn, businessFieldConverterToKr } from "@/utils/businessFieldConverter";
import { nationConverter, nationConverterToKr } from "@/utils/nationConverter";
import { buildImgUrl } from "@/utils/media";
import { useLocale, useTranslations } from "next-intl";

type CreatorBidRequestConditionPageProps = {
  bidRequestDetail: BidRequestT;
};

export function CreatorBidRequestConditionPage({
  bidRequestDetail,
}: CreatorBidRequestConditionPageProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();
  const user = getServerUserInfo();
  const [messageContent, setMessageContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("creatorBidRequestConditionPage");
  const locale = useLocale();

  function handleContentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageContent(e.target.value);
  }

  const { data: bidRequestMessages$, actions: bidRequestMessagesAct } =
    useListData({
      listFn: async (listOpt) => {
        return await BidRequestMessagesApi.list(listOpt);
      },
    });

  async function createMessage() {
    try {
      if (!messageContent || messageContent === "") return;
      const payload: BidRequestMessageFormT = {
        bidRequestId: bidRequestDetail.id,
        userId: user.id,
        content: messageContent,
      };

      await BidRequestMessagesApi.create({ form: payload });
      bidRequestMessagesAct.load(bidRequestListOpt);
      router.refresh();
    } catch (e: any) {
      enqueueSnackbar(`${t("anErrorOccurredWhileSendingTheMessage")}`, {
        variant: "error",
      });
      router.refresh();
    }
  }

  const { status: messagesStatus, data: messages } = bidRequestMessages$;

  const bidRequestListOpt: ListBidRequestMessageOptionT = {
    bidRequestId: bidRequestDetail.id,
  };

  useEffect(() => {
    bidRequestMessagesAct.load(bidRequestListOpt);
  }, []);

  if (messagesStatus == "idle" || messagesStatus == "loading") {
    return <Spinner />;
  }

  if (messagesStatus == "error") {
    return <ErrorComponent />;
  }

  function checkIsExpired(negoStartAt: Date | string) {
    const negoStartDate = new Date(negoStartAt);
    const currentDate = new Date();
    const returnData = negoStartDate.getTime() < currentDate.getTime();
    return returnData;
  }

  async function handleClickAccept() {
    try {
      const isOk = await showAlertDialog({
        title: `${t("acceptOffer")}`,
        body: `${t("wouldYouLikeToAcceptTheOffer")}`,
        useOk: true,
        useCancel: true,
      });

      if (!isOk) return;

      if (bidRequestDetail.round?.negoStartAt) {
        if (checkIsExpired(bidRequestDetail.round?.negoStartAt) === false) {
          enqueueSnackbar(`${t("thisIsNotAnOfferDecisionPeriod")}`, {
            variant: "error",
          });
          return;
        }
      }
      await BidRequestApi.accept({ id: bidRequestDetail.id });
      router.refresh();
    } catch (e: any) {
      const message = e.response.data.message;
      if (message === "request already cancelled") {
        enqueueSnackbar(`${t("theOfferHasAlreadyBeenCanceled")}`, {
          variant: "error",
        });
        router.refresh();
      }
    }
  }

  async function handleClickReject() {
    try {
      const isOk = await showAlertDialog({
        title: `${t("rejectOffer")}`,
        body: `${t("wouldYouLikeToRejectTheOffer")}`,
        useOk: true,
        useCancel: true,
      });

      if (!isOk) return;

      if (bidRequestDetail.round?.negoStartAt) {
        if (checkIsExpired(bidRequestDetail.round?.negoStartAt) === false) {
          enqueueSnackbar(`${t("thisIsNotAnOfferDecisionPeriod")}`, {
            variant: "error",
          });
          return;
        }
      }
      await BidRequestApi.reject({ id: bidRequestDetail.id });
      router.refresh();
    } catch (e: any) {
      const message = e.response.data.message;
      if (message === "request already cancelled") {
        enqueueSnackbar(`${t("theOfferHasAlreadyBeenCanceled")}`, {
          variant: "error",
        });
        router.refresh();
      }
    }
  }

  return (
    <Col>
      <Col>
        <Text className="text-white text-[24pt] font-bold">
          {t("buyerInformation")}
        </Text>
        <Gap y={10} />
        <Row>
          <Row className="w-[70%]">
            <div className="w-[115px] h-[115px] overflow-hidden relative rounded-full">
              <Image
                src={
                  bidRequestDetail.buyer?.companyInfo.thumbPath
                    ? buildImgUrl(
                      null,
                      bidRequestDetail.buyer.companyInfo.thumbPath,
                      { size: "xs" }
                    )
                    : "/img/webtoon_default_image_small.svg"
                }
                alt={`${bidRequestDetail.buyer?.companyInfo.thumbPath}`}
                style={{ objectFit: "cover" }}
                fill
              />
            </div>
            <Gap x={10} />
            <Col>
              <Text className="text-white text-[24pt] font-bold">
                {bidRequestDetail.buyer?.name}
              </Text>
              {/* <Text className="text-white">{bidRequestDetail.buyer?.companyInfo.email}</Text> */}
              <Gap y={4} />
              <Text className="text-white text-[18pt] font-bold">
                {bidRequestDetail.buyer?.companyInfo.name} /{" "}
                {bidRequestDetail.buyer?.companyInfo.dept} /{" "}
                {bidRequestDetail.buyer?.companyInfo.position}
              </Text>
            </Col>
          </Row>
          {user.id === bidRequestDetail.round?.userId &&
          !bidRequestDetail.acceptedAt &&
          !bidRequestDetail.rejectedAt &&
          !bidRequestDetail.cancelledAt ? (
            <Row className="m-auto w-[30%] justify-evenly">
                <Button className="w-[120px] bg-red" onClick={handleClickReject}>
                {t("reject")}
              </Button>
                {/* <Button className="w-[120px] bg-gray-shade">협의요청</Button> */}
                <Button className="w-[120px] bg-mint" onClick={handleClickAccept}>
                {t("accept")}
              </Button>
              </Row>
            ) : null}

          {user.id === bidRequestDetail.round?.userId &&
          bidRequestDetail.rejectedAt &&
          !bidRequestDetail.cancelledAt ? (
            <Row className="m-auto w-[30%] justify-evenly">
                <Button disabled className="w-[120px] bg-red">
                {t("rejectComplete")}
              </Button>
              </Row>
            ) : null}

          {user.id === bidRequestDetail.round?.userId &&
          bidRequestDetail.acceptedAt ? (
            <Row className="m-auto w-[30%] justify-evenly">
                <Button disabled className="w-[120px] bg-mint">
                {t("acceptComplete")}
              </Button>
              </Row>
            ) : null}

          {user.id === bidRequestDetail.round?.userId &&
          bidRequestDetail.cancelledAt ? (
            <Row className="m-auto w-[30%] justify-evenly">
                <Button disabled className="w-[120px] bg-red">
                {t("cancelledOffer")}
              </Button>
              </Row>
            ) : null}
        </Row>
      </Col>

      <Gap y={20} />
      <hr className="border-gray-shade" />
      <Gap y={20} />

      <Text className="text-white text-[24pt] font-bold">
        {t("detailsOfConsultation")}
      </Text>
      <Gap y={10} />
      <Col className="bg-gray-darker pt-5 rounded-sm flex justify-between">
        <Col className="overflow-y-scroll max-h-[300px] flex-col-reverse">
          {messages.length > 0 ? (
            messages.map((message) => (
              <Row
                key={message.id}
                className={`${
                  user.id === message.userId
                    ? "justify-end mr-5"
                    : "justify-start ml-5"
                }`}
              >
                <p
                  className={`${
                    user.id === message.userId
                      ? "bg-mint text-white px-5 py-2 my-1 rounded-full"
                      : "bg-white text-black px-5 py-2 my-1 rounded-full"
                  }`}
                >
                  {message.content}
                </p>
              </Row>
            ))
          ) : (
            <Text className="text-center text-gray pb-5">
              {t("consultationDoesNotExist")}
            </Text>
          )}
        </Col>
        {user.id === bidRequestDetail.round?.userId && (
          <Row className="">
            <Input
              type="text"
              className="text-black"
              onChange={handleContentChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSubmitting) {
                  setIsSubmitting(true);
                  createMessage().finally(() => setIsSubmitting(false));
                }
              }}
            />
            <Button
              className="bg-mint"
              onClick={() => {
                if (!isSubmitting) {
                  setIsSubmitting(true);
                  createMessage().finally(() => setIsSubmitting(false));
                }
              }}
            >
              {t("send")}
            </Button>
          </Row>
        )}
      </Col>

      <Gap y={20} />

      <Col>
        <Text className="text-white text-[24pt] font-bold">
          {t("offerContent")}
        </Text>
        <Gap y={10} />

        {bidRequestDetail.contractRange.data.length > 0 &&
        bidRequestDetail.contractRange.data.filter(
          (data) => data.businessField === "webtoon"
        ).length > 0 ? (
          <Col>
              <Text className="text-white text-[14pt] font-bold">
              {t("webtoonSerialRights")}
            </Text>
              <Gap y={5} />
              <Table className="text-white">
              <TableHeader>
                  <TableRow>
                  <TableHead className="text-white w-[33%] text-center border">
                      {t("serviceRegion")}
                    </TableHead>
                  <TableHead className="text-white w-[33%] text-center border">
                      {t("exclusiveRights")}
                    </TableHead>
                  <TableHead className="text-white w-[33%] text-center border">
                      {t("proposalTermsAndConditions")}
                    </TableHead>
                </TableRow>
                </TableHeader>
              <TableBody>
                  {bidRequestDetail.contractRange.data
                    .filter((data) => data.businessField === "webtoon")
                    .map((data, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-center border">
                          {locale === "en"
                            ? nationConverter(data.country)
                            : nationConverterToKr(data.country)}
                        </TableCell>
                        <TableCell className="text-center border">
                          {data.contract === "exclusive"
                            ? `${t("exclusive")}`
                            : `${t("nonExclusive")}`}
                        </TableCell>
                        <TableCell className="text-center border">
                          {data.message}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Col>
          ) : null}

        <Gap y={20} />

        {bidRequestDetail.contractRange.data.length > 0 &&
        bidRequestDetail.contractRange.data.filter(
          (data) => data.businessField !== "webtoon"
        ).length > 0 ? (
          <Col>
              <Text className="text-white text-[14pt] font-bold">2차 사업권</Text>
              <Gap y={5} />
              <Table className="text-white">
              <TableHeader>
                  <TableRow>
                  <TableHead className="text-white w-[33%] text-center border">
                      {t("businessRightClassification")}
                    </TableHead>
                  <TableHead className="text-white w-[33%] text-center border">
                      {t("countryOfDistribution")}
                    </TableHead>
                  <TableHead className="text-white w-[33%] text-center border">
                      {t("proposalTermsAndConditions")}
                    </TableHead>
                </TableRow>
                </TableHeader>
              <TableBody>
                  {bidRequestDetail.contractRange.data
                    .filter((data) => data.businessField !== "webtoon")
                    .map((data, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-center border">
                          {locale === "en"
                            ? businessFieldConverterToEn(data.businessField)
                            : businessFieldConverterToKr(data.businessField)}
                        </TableCell>
                        <TableCell className="text-center border">
                          {locale === "en"
                            ? nationConverter(data.country)
                            : nationConverterToKr(data.country)}
                        </TableCell>
                        <TableCell className="text-center border">
                          {data.message}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Col>
          ) : null}
      </Col>

      <Gap y={20} />

      <Col>
        <Text className="text-white text-[24pt] font-bold">
          {t("toTheCopyrightHolder")}
        </Text>
        <Gap y={5} />
        {bidRequestDetail.message ? (
          <Row className="bg-gray-darker p-5 rounded-sm">
            <Text className="text-white text-[12pt]">
              {bidRequestDetail.message}
            </Text>
          </Row>
        ) : (
          <Row className="bg-gray-darker p-5 rounded-sm">
            <Text className="text-gray text-[12pt]">
              {t("thereIsNoMessageWrittenByTheBuyer")}
            </Text>
          </Row>
        )}
      </Col>

      <Gap y={20} />
    </Col>
  );
}
