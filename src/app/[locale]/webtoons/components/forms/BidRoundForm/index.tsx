"use client";

import { useEffect, useState } from "react";
import { Heading2 } from "@/components/ui/texts";
import { Gap, Row } from "@/components/ui/layouts";
import { Input } from "@/components/ui/shadcn/Input";
import { Button } from "@/components/ui/shadcn/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/RadioGroup";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Checkbox } from "@/components/ui/shadcn/CheckBox";
import { useTranslations } from "next-intl";
import { BidRoundFormSchema, BidRoundFormT, BidRoundT } from "@/resources/bidRounds/bidRound.types";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import BidRoundFormContractRange from "@/app/[locale]/webtoons/components/forms/BidRoundForm/BidRoundFormContractRange";
import { TemplatedForm } from "@/components/TemplatedForm";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/shadcn/Form";
import Spinner from "@/components/Spinner";
import { updateBidRound } from "@/resources/bidRounds/bidRound.service";

export default function BidRoundForm({ webtoonId, prev }: {
  webtoonId: number
  prev?: BidRoundT
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  // TODO
  // const [invalidFields, setInvalidFields] = useState<
  //   { index: number; field: string }[]
  // >([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const form = useForm<BidRoundFormT>({
    defaultValues: {
      webtoonId,
      contractRange: prev?.contractRange,
      isOriginal: prev?.isOriginal,
      isNew: prev?.isNew,
      episodeCount: prev?.episodeCount || 0,
      currentEpisodeNo: prev?.currentEpisodeNo || 0,
      monthlyEpisodeCount: prev?.monthlyEpisodeCount || 0,
    }
  });

  // 필수 필드 체크
  const fieldValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  useEffect(() => {
    const { success } = BidRoundFormSchema.safeParse(fieldValues);
    setAllRequiredFilled(success && isAgreed);
  }, [fieldValues]);

  // 제출 이후 동작
  const router = useRouter();
  async function onSubmit(bidRoundForm: BidRoundFormT) {
    setSubmissionInProgress(true);
    await updateBidRound(bidRoundForm);
    // TODO
    if(prev) {
      router.replace(`/webtoons/${webtoonId}`);
    } else {
      router.replace("/webtoons");
    }
  }

  // 스피너
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  if (submissionInProgress) {
    return <Spinner/>;
  }

  return (
    <TemplatedForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 기본 정보 */}
        <Heading2>
          {t("generalInformation")}
          <IconExclamation className="fill-white ml-1"/>
        </Heading2>

        <IsNewFieldSet form={form}/>

        {fieldValues.isNew
          ? (
            <>
              <EpisodeCountFieldSet form={form}/>
              <MonthlyCountFieldSet form={form}/>
            </>
          ) : <FinishedFieldSet form={form}/>}

        <OriginalityFieldSet form={form}/>

        {/* 계약 상세 */}
        <Heading2 className="mt-16">
          {t("currentStatusOfCopyrightAgreement")}
          <IconExclamation className="fill-white ml-1"/>
        </Heading2>

        <BidRoundFormContractRange form={form}/>

        {/* 동의 박스 */}
        <FormItem className="flex justify-center gap-2 items-center mt-16">
          <FormLabel>
            {t("agreement")}
          </FormLabel>
          <FormControl>
            <Checkbox
              checked={isAgreed}
              onCheckedChange={(checked) => {
                setIsAgreed(Boolean(checked));
              }}
            />
          </FormControl>
        </FormItem>

        <Gap y={20}/>

        {/* 등록 버튼 */}
        <Row className="justify-end">
          <Button
            disabled={!allRequiredFilled}
            type="submit"
            className="rounded-full bg-mint text-white"
          >
            {t("register")}
            <Gap x={2}/>
            <IconRightBrackets className="fill-white"/>
          </Button>
        </Row>

      </form>
    </TemplatedForm>
  );
}


function IsNewFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const items = [
    {
      value: true,
      label: t("newWork"),
    },
    {
      value: false,
      label: t("oldWork"),
    }
  ];
  return (
    <fieldset>
      <legend>{t("productType")}</legend>
      <FormField
        control={form.control}
        name="isNew"
        render={({ field }) => (
          <FormItem className="mt-3">
            <FormControl>
              <RadioGroup
                {...field}
                defaultValue={field.value?.toString()}
                value={undefined}
                className="flex flex-wrap gap-3"
                onValueChange={(value) => {
                  field.onChange(JSON.parse(value));
                }}
              >
                {items.map((item, index) => (
                  <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
                    <FormControl>
                      <RadioGroupItem
                        className="border border-white"
                        value={item.value.toString()}
                      />
                    </FormControl>
                    <FormLabel>
                      {item.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </fieldset>
  );
}


function EpisodeCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <fieldset>
      <legend>{t("serialInformation")}</legend>
      <Row className="gap-4">

        <FormField
          control={form.control}
          name="currentEpisodeNo"
          render={({ field }) => (
            <FormItem className="mt-3 flex items-center">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="_"
                  className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
                />
              </FormControl>
              <FormLabel className="ml-2">
                {t("currentEpisode")}
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="episodeCount"
          render={({ field }) => (
            <FormItem className="mt-3 flex items-center">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="_"
                  className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
                />
              </FormControl>
              <FormLabel className="ml-2">
                {t("expectingOrFinishedEpisode")}
              </FormLabel>
            </FormItem>
          )}
        />

      </Row>
    </fieldset>
  );
}

function MonthlyCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <fieldset>
      <legend>{t("monthlyProductionAvailableRounds")}</legend>
      <Row>
        <FormField
          control={form.control}
          name="monthlyEpisodeCount"
          render={({ field }) => (
            <FormItem className="mt-3 flex items-center">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="_"
                  className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
                />
              </FormControl>
              <FormLabel className="ml-2">
                {t("episodesPossible")}
              </FormLabel>
            </FormItem>
          )}
        />

      </Row>
    </fieldset>

  );
}

function FinishedFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <fieldset>
      <legend>{t("serialInformation")}</legend>
      <Row>
        <FormField
          control={form.control}
          name="episodeCount"
          render={({ field }) => (
            <FormItem className="mt-3 flex items-center">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="_"
                  className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black"
                />
              </FormControl>
              <FormLabel className="ml-2">
                {t("finishedEpisode")}
              </FormLabel>
            </FormItem>
          )}
        />
      </Row>
    </fieldset>
  );
}


function OriginalityFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const items = [
    {
      value: true,
      label: t("yes"),
    },
    {
      value: false,
      label: t("no"),
    }
  ];
  return (
    <fieldset>
      <legend>{t("SerializationOfOtherPlatforms")}</legend>
      <FormField
        control={form.control}
        name="isOriginal"
        render={({ field }) => (
          <FormItem className="mt-3">
            <FormControl>
              <RadioGroup
                {...field}
                defaultValue={field.value?.toString()}
                value={undefined}
                className="flex flex-wrap gap-3"
                onValueChange={(value) => {
                  field.onChange(JSON.parse(value));
                }}
              >
                {items.map((item, index) => (
                  <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
                    <FormControl>
                      <RadioGroupItem
                        className="border border-white"
                        value={item.value.toString()}
                      />
                    </FormControl>
                    <FormLabel>
                      {item.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </fieldset>
  );
}
