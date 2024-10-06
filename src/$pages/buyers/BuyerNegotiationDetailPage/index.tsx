"use client";

import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Input } from "@/ui/shadcn/Input";
import { Label } from "@/ui/shadcn/Label";
import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/Table";
import { Text } from "@/ui/texts";
import { businessFieldConverterToEn, businessFieldConverterToKr } from "@/utils/businessFieldConverter";
import { buildImgUrl } from "@/utils/media";
import { nationConverter, nationConverterToKr } from "@/utils/nationConverter";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as BidRequestApi from "@/apis/bid_request";
import { Button } from "@/ui/shadcn/Button";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useMe } from "@/states/UserState";
import * as BidRequestMessagesApi from "@/apis/bid_request_message";
import { useListData } from "@/hooks/ListData";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import {
  BidRequestMessageFormT,
  BidRequestT,
  ListBidRequestMessageOptionT,
} from "@/types";

type BuyerNegotiationDetailPageProps = {
  bidRequest: BidRequestT;
};

export function BuyerNegotiationDetailPage({
  bidRequest,
}: BuyerNegotiationDetailPageProps) {
  const router = useRouter();
  const bidRound = bidRequest.round;
  const webtoon = bidRequest.webtoon;
  const creator = bidRequest.creator;
  const locale = useLocale();
  const t = useTranslations("buyerNegotiationDetailPage");
  const TcontractRangeData = useTranslations("contractRangeData");
  const Tbusiness = useTranslations("businessFieldENG");
  const me = useMe();
  const [messageContent, setMessageContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        bidRequestId: bidRequest.id,
        userId: me?.id ?? 0,
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
    bidRequestId: bidRequest.id,
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

  async function handleDelete() {
    try {
      if (bidRequest) {
        await BidRequestApi.cancel({ id: bidRequest.id });
        enqueueSnackbar("오퍼가 취소되었습니다.", { variant: "success" });
        router.refresh();
        router.back();
      } else return;
    } catch (e: any) {
      console.warn(e);
      const message = e.response.data.message;
      if (message === "request already rejected") {
        enqueueSnackbar("이미 거절 된 오퍼입니다.", { variant: "error" });
        router.refresh();
      } else if (message === "request already accepted") {
        enqueueSnackbar("이미 수락 된 오퍼입니다.", { variant: "error" });
        router.refresh();
      } else {
        enqueueSnackbar("오퍼 취소에 실패했습니다.", { variant: "error" });
        router.refresh();
      }
    }
  }

  return (
    <Container className="text-white">
      <Gap y={20} />
      <Col className="justify-between items-center">
        <Col className="w-full justify-center items-center md:items-start md:flex-row md:justify-start">
          <Col className="rounded-sm justify-center bg-gray-darker">
            {bidRequest.webtoon?.thumbPath == null ? (
              <div className="w-[300px] h-[450px] rounded-md bg-gray" />
            ) : (
              <div className="w-[300px] h-[450px] overflow-hidden relative rounded-sm">
                <Image
                  src={
                    bidRequest.webtoon?.thumbPath
                      ? buildImgUrl(null, bidRequest.webtoon.thumbPath, {
                        size: "md",
                      })
                      : "/img/webtoon_default_image_small.svg"
                  }
                  alt={`${bidRequest.webtoon?.thumbPath}`}
                  style={{ objectFit: "cover" }}
                  fill
                />
              </div>
            )}
          </Col>

          <Gap x={15} />
          <Gap y={20} />

          <Col>
            <Col>
              <Row className="justify-between">
                <Text className="text-[24pt] text-white">
                  {locale === "ko"
                    ? bidRequest.webtoon?.title
                    : bidRequest.webtoon?.title_en ??
                      bidRequest.webtoon?.title}{" "}
                </Text>
              </Row>
              <Gap y="16px" />
              <Row>
                <Text className="text-[16pt] text-white">
                  {locale === "ko"
                    ? webtoon?.authorDetail ?? creator?.name ?? "알 수 없음"
                    : webtoon?.authorDetail_en ??
                      creator?.name_en ??
                      webtoon?.authorDetail ??
                      webtoon?.creator?.name ??
                      "Unknown"}
                </Text>
                <Gap x={4} />
                <Text className="text-[16pt] text-white">|</Text>
                <Gap x={4} />
                <Text className="text-[16pt] text-white">
                  {bidRequest.webtoon?.ageLimit
                    ? bidRequest.webtoon.ageLimit
                    : locale === "ko"
                      ? "전체이용가"
                      : "ALL"}
                </Text>
              </Row>
              <Gap y="16px" />
              <Text className="text-[12pt] text-white">
                {locale === "ko"
                  ? bidRequest.webtoon?.description
                  : bidRequest.webtoon?.description_en ??
                    bidRequest.webtoon?.description}
              </Text>
              <Gap y="16px" />
            </Col>
          </Col>
        </Col>
      </Col>

      <Gap y={20} />

      <Col>
        <Row>
          <Text className="text-[18pt] text-white">
            {t("generalInformation")}
          </Text>
          <Gap x={3} />
          <IconExclamation className="fill-white" />
        </Row>
        <Gap y={10} />
        <Row>
          <Col className="h-[70px]">
            <Text className="text-white">{t("productType")}</Text>
            <Gap y={3} />
            <RadioGroup
              disabled
              className="flex flex-wrap"
              value={`${bidRound?.isBrandNew}`}
            >
              <Row>
                <RadioGroupItem value="true" className="border-white" />
                <Label>{t("newWork")}</Label>
                <Gap x={2} />
                <RadioGroupItem value="false" className="border-white" />
                <Label>{t("oldWork")}</Label>
              </Row>
            </RadioGroup>
          </Col>
          <Gap x={20} />
          <Col className="h-[70px]">
            <Text className="text-white">
              {t("SerializationOfOtherPlatforms")}
            </Text>
            <Gap y={3} />
            <RadioGroup
              disabled
              className="flex flex-wrap"
              value={`${bidRound?.originality}`}
            >
              <Row>
                <RadioGroupItem value="original" className="border-white" />
                <Label>{t("yes")}</Label>
                <Gap x={2} />
                <RadioGroupItem value="notOriginal" className="border-white" />
                <Label>{t("no")}</Label>
              </Row>
            </RadioGroup>
          </Col>
          <Gap x={20} />
          <Col className="h-[70px]">
            <Text className="text-white">{t("serialInformation")}</Text>
            <Gap y={3} />
            <Row>
              <Input
                disabled
                value={bidRound?.numEpisode ? bidRound.numEpisode : 0}
                className="bg-white w-[30px] p-0 text-center text-black"
              />
              <Gap x={2} />
              <Text className="text-white">{t("finishedEpisode")}</Text>
            </Row>
          </Col>
        </Row>

        {bidRound ? (
          <Row className="justify-between items-start mt-[40px]">
            {bidRound.contractRange.data.filter(
              (item) => item.businessField === "webtoon"
            ).length > 0 ? (
              <Row className="w-[48%]">
                  <Col className="w-full">
                  <Row className="justify-between">
                      <Text className="text-white text-[14pt] font-bold">
                      {TcontractRangeData("webtoonServiceRegion")}
                    </Text>
                      <Row>
                      <RadioGroup disabled value={"1"}>
                          <Row>
                          <RadioGroupItem value="1" className="border-mint" />
                          <Gap x={1} />
                          <Label>{TcontractRangeData("exclusive")}</Label>
                          <Gap x={5} />
                          <RadioGroupItem value="2" className="border-mint" />
                          <Gap x={1} />
                          <Label>{TcontractRangeData("nonExclusive")}</Label>
                        </Row>
                        </RadioGroup>
                    </Row>
                    </Row>
                  <Gap y={5} />
                  <Table className="text-white">
                      <TableHeader>
                      <TableRow>
                          <TableHead className="text-white w-[33%] text-center border">
                          {TcontractRangeData("serviceCountry")}
                        </TableHead>
                          <TableHead className="text-white w-[33%] text-center border">
                          {TcontractRangeData("exclusiveOrNon")}
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                      <TableBody>
                      {bidRound.contractRange.data
                          .filter((item) => item.businessField === "webtoon")
                          .map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-center border">
                                {locale === "ko"
                                  ? nationConverterToKr(data.country)
                                  : nationConverter(data.country)}
                              </TableCell>
                              <TableCell className="text-center border">
                                <RadioGroup disabled>
                                  <RadioGroupItem
                                    value="exclusive"
                                    className="border-mint m-auto"
                                    checked={data.contract === "exclusive"}
                                  />
                                </RadioGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                    </Table>
                </Col>
                </Row>
              ) : null}
            {bidRound.contractRange.data.filter(
              (item) => item.businessField !== "webtoon"
            ).length > 0 ? (
              <Row className="w-[48%]">
                  <Col className="w-full">
                  <Row className="justify-between">
                      <Text className="text-white text-[14pt] font-bold">
                      {TcontractRangeData("secondaryCopyrightSalesStatus")}
                    </Text>
                      <Row>
                      <RadioGroup disabled value={"1"}>
                          <Row>
                          <RadioGroupItem value="1" className="border-mint" />
                          <Gap x={1} />
                          <Label>{TcontractRangeData("exclusive")}</Label>
                          <Gap x={5} />
                          <RadioGroupItem value="2" className="border-mint" />
                          <Gap x={1} />
                          <Label>{TcontractRangeData("nonExclusive")}</Label>
                        </Row>
                        </RadioGroup>
                    </Row>
                    </Row>
                  <Gap y={5} />
                  <Table className="text-white">
                      <TableHeader>
                      <TableRow>
                          <TableHead className="text-white w-[33%] text-center border">
                          {TcontractRangeData("secondaryCopyright")}
                        </TableHead>
                          <TableHead className="text-white w-[33%] text-center border">
                          {TcontractRangeData("serviceCountry")}
                        </TableHead>
                          <TableHead className="text-white w-[33%] text-center border">
                          {TcontractRangeData("exclusiveOrNon")}
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                      <TableBody>
                      {bidRound.contractRange.data
                          .filter((item) => item.businessField !== "webtoon")
                          .map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-center border">
                                {Tbusiness(data.businessField)}
                              </TableCell>
                              <TableCell className="text-center border">
                                {locale === "ko"
                                  ? nationConverterToKr(data.country)
                                  : nationConverter(data.country)}
                              </TableCell>
                              <TableCell className="text-center border">
                                <RadioGroup disabled>
                                  <RadioGroupItem
                                    value="exclusive"
                                    className="border-mint m-auto"
                                    checked={data.contract === "exclusive"}
                                  />
                                </RadioGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                    </Table>
                </Col>
                </Row>
              ) : null}
          </Row>
        ) : null}

        <Gap y={10} />
        <hr className="border border-gray-dark" />
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
                    me?.id === message.userId
                      ? "justify-end mr-5"
                      : "justify-start ml-5"
                  }`}
                >
                  <p
                    className={`${
                      me?.id === message.userId
                        ? "bg-mint text-white px-5 py-2 my-1 rounded-full"
                        : "bg-white text-black px-5 py-2 my-1 rounded-full"
                    }`}
                  >
                    {message.content}
                  </p>
                </Row>
              ))
            ) : (
              <Text className="text-center text-gray">
                {t("consultationDoesNotExist")}
              </Text>
            )}
          </Col>
          {me?.id === bidRequest.buyer?.userId && (
            <Row className="mt-5">
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
            {t("offerPreview")}
          </Text>
          <Gap y={10} />

          {bidRequest.contractRange.data.length > 0 &&
          bidRequest.contractRange.data.filter(
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
                    {bidRequest.contractRange.data
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

          {bidRequest.contractRange.data.length > 0 &&
          bidRequest.contractRange.data.filter(
            (data) => data.businessField !== "webtoon"
          ).length > 0 ? (
            <Col>
                <Text className="text-white text-[14pt] font-bold">
                {t("secondBusinessRight")}
              </Text>
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
                    {bidRequest.contractRange.data
                      .filter((data) => data.businessField !== "webtoon")
                      .map((data, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-center border">
                            {locale === "en"
                              ? businessFieldConverterToEn(data.businessField) :
                              businessFieldConverterToKr(data.businessField)}
                          </TableCell>
                          <TableCell className="text-center border">
                            {locale === "en" ? nationConverter(data.country) :
                            nationConverterToKr(data.country)}
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
          <Text className=" text-[14pt] text-white font-bold">
            {t("toTheCopyrightHolder")}
          </Text>
          <Gap y={5} />
          <Row className="p-5 bg-gray-darker rounded-sm">
            {bidRequest.message}
          </Row>

          <Gap y={20} />
          {me?.id === bidRequest.buyer?.userId ? (
            <Row className=" justify-center">
              {!bidRequest.cancelledAt &&
              !bidRequest.rejectedAt &&
              !bidRequest.acceptedAt ? (
                <Button className="bg-red p-4" onClick={handleDelete}>
                    {t("cancelOffer")}
                  </Button>
                ) : null}

              {bidRequest.cancelledAt ? (
                <Button
                  disabled
                  className="bg-red p-4"
                  onClick={() => {
                    return;
                  }}
                >
                  {t("offerCanceled")}
                </Button>
              ) : null}

              {bidRequest.rejectedAt ? (
                <Button
                  disabled
                  className="bg-red p-4"
                  onClick={() => {
                    return;
                  }}
                >
                  {t("rejectedOffer")}
                </Button>
              ) : null}

              {bidRequest.acceptedAt ? (
                <Button
                  disabled
                  className="bg-mint p-4"
                  onClick={() => {
                    return;
                  }}
                >
                  {t("acceptedOffer")}
                </Button>
              ) : null}
            </Row>
          ) : null}
        </Col>
      </Col>

      <Gap y={40} />
    </Container>
  );
}
