import { BidRoundT } from "@/resources/bidRounds/bidRound.types";
import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import React from "react";
import { getTranslations } from "next-intl/server";

export default async function ContractRangeBasic({ bidRound }: {
  bidRound: BidRoundT
}) {

  const t = await getTranslations("contractRangeData");

  return <Col>
    <Row>
      <h2 className="text-lg font-bold">
        {t("seriesInformation")}
      </h2>
      <IconExclamation className="fill-white ml-3"/>
    </Row>
    <Col className="p-5">
      <Row className="gap-10">
        <IsNewIndicator isNew={bidRound.isNew}/>
        <IsOriginalIndicator isOriginal={bidRound.isOriginal}/>
        <ProgressIndicator episodeNo={bidRound.currentEpisodeNo}/>
      </Row>
      {/*TODO 더 이상 사용 안하는지?*/}
      {/*<Gap y={2}/>*/}
      {/*{bidRound.monthlyNumEpisode && (*/}
      {/*  <>*/}
      {/*    <Gap y={4}/>*/}
      {/*    <Text className="text-white">*/}
      {/*      {t("monthlyProductionAvailableRounds")}*/}
      {/*    </Text>*/}
      {/*    <Gap y={2}/>*/}
      {/*    <Row>*/}
      {/*      <Input*/}
      {/*        placeholder="_"*/}
      {/*        defaultValue={bidRound.monthlyNumEpisode}*/}
      {/*        className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"*/}
      {/*      />*/}
      {/*      <Gap x={2}/>*/}
      {/*      {t("episodesPossible")}*/}
      {/*    </Row>*/}
      {/*  </>*/}
      {/*)}*/}
    </Col>
  </Col>;
}

async function IsNewIndicator({ isNew }: {
  isNew: boolean
}) {
  const t = await getTranslations("contractRangeData");
  return <Col>
    <Text className="text-white">{t("seriesType")}</Text>
    <Gap y={2} />

    <RadioGroup
      disabled
      value={isNew.toString()}
    >
      <Row>
        <RadioGroupItem value="true" className="border-white" />
        <Label>{t("latestContent")}</Label>
        <Gap x={2} />
        <RadioGroupItem value="false" className="border-white" />
        <Label>{t("earliestContent")}</Label>
      </Row>
    </RadioGroup>
  </Col>;
}

async function IsOriginalIndicator({ isOriginal }: {
  isOriginal: boolean
}) {
  const t = await getTranslations("contractRangeData");
  return <Col>
    <Text className="text-white">{t("serviceOnOtherPlatforms")}</Text>
    <Gap y={2}/>
    <RadioGroup
      disabled
      value={isOriginal.toString()}
    >
      <Row>
        <RadioGroupItem value="true" className="border-white"/>
        <Label>{t("yes")}</Label>
        <Gap x={2}/>
        <RadioGroupItem value="false" className="border-white"/>
        <Label>{t("no")}</Label>
      </Row>
    </RadioGroup>
  </Col>;
}

async function ProgressIndicator({ episodeNo }: {
  episodeNo?: number
}) {
  const t = await getTranslations("contractRangeData");
  // TODO 완결은 그냥 하드코딩된 글자인지?

  return <Col>
    <Text className="text-white">{t("serviceEpisodeInformation")}</Text>
    <Row>
      {episodeNo && <>
        <Input
          placeholder="_"
          defaultValue={episodeNo}
          className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
        />
        <Gap x={2}/>
        {t("completedEpisodes")}
        <Gap x={2}/>
      </>}

      <Gap x={2}/>
      <div className="bg-gray-darker p-0 text-center rounded px-2 py-0.5">
        {episodeNo || "718"}
      </div>
      <Gap x={2}/>
      {t("episodesCompleted")}
    </Row>
  </Col>;
}