"use client";

import { useState } from "react";
import { Heading2 } from "@/components/ui/common";
import { Row } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { useTranslations } from "next-intl";
import { BidRoundFormSchema, BidRoundFormT, BidRoundT } from "@/resources/bidRounds/dtos/bidRound.dto";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import {
  BooleanFormField,
  FieldSet,
  Form,
  FormControl,
  FormItem,
  FormLabel
} from "@/shadcn/ui/form";
import ContractRangeForm from "@/components/forms/ContractRangeForm";
import { NumericInput } from "@/shadcn/ui/input";
import { createOrUpdateBidRound } from "@/resources/bidRounds/controllers/bidRound.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import useSafeActionForm from "@/hooks/safeActionForm";

export default function BidRoundForm({ webtoonId, prev }: {
  webtoonId: number;
  prev?: BidRoundT;
}) {
  const t = useTranslations("bidRoundDetails");
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();
  const { isFormSubmitting, form, onSubmit } = useSafeActionForm(
    createOrUpdateBidRound.bind(null, webtoonId, prev?.id),
    {
      defaultValues: prev,
      mode: "onChange",
      resolver: (values, ...rest) => {
        const { isNew, currentEpisodeNo, totalEpisodeCount } = values;
        if (isNew
        && typeof currentEpisodeNo === "number"
        && typeof totalEpisodeCount === "number"
        && currentEpisodeNo > totalEpisodeCount
        ) {
          return {
            values: {},
            errors: {
              currentEpisodeNo: {
                type: "invalidNumber",
                message: t("form.currentEpisodeNoMustBeLessThanTotal")
              },
            }
          };
        }
        return zodResolver(BidRoundFormSchema)(values, ...rest);
      },
      actionProps: {
        onSuccess: () => {
          if (prev) {
            router.replace(`/webtoons/${webtoonId}`);
          } else {
            router.replace("/webtoons");
          }
        }
      }
    });

  // 조건부 필드
  const isNew = useWatch({
    control: form.control,
    name: "isNew"
  });

  const { formState: { isValid, isDirty } } = form;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={clsx({
        "form-overlay": isFormSubmitting
      })}>
        {/* 기본 정보 */}
        <Heading2>
          {t("generalInformation")}
          <IconExclamation className="fill-white ml-1"/>
        </Heading2>

        <IsNewFieldSet form={form}/>

        {isNew
          ? (
            <>
              <EpisodeCountFieldSet form={form} />
              <MonthlyCountFieldSet form={form}/>
            </>
          ) : <FinishedFieldSet form={form}/>}

        <OriginalityFieldSet form={form}/>

        {/* 계약 상세 */}
        <Heading2 className="mt-16">
          {t("form.currentStatusOfCopyrightAgreement")}
          <IconExclamation className="fill-white ml-1"/>
        </Heading2>

        <ContractRangeForm form={form as never} formType="bidRound"/>
        {/*TODO never*/}

        {/* 동의 박스 */}
        <FormItem className="flex justify-center gap-2 items-center mt-16">
          <FormLabel>
            {t("form.agreement")}
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

        {/* 등록 버튼 */}
        <Row className="justify-end mt-20">
          <Button
            disabled={!isValid || !isAgreed || !isDirty}
            className="rounded-full"
            variant="mint"
          >
            {t("form.register")}
            <IconRightBrackets />
          </Button>
        </Row>

      </form>
    </Form>
  );
}


function IsNewFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
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
    <FieldSet>
      <legend>{t("seriesType")}</legend>
      <BooleanFormField
        control={form.control}
        name="isNew"
        items={items}
        className="mt-3"
      />
    </FieldSet>
  );
}


function EpisodeCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  const { errors } = form.formState;

  return (
    <FieldSet>
      <legend>{t("serviceEpisodeInformation")}</legend>
      <Row className="gap-4">

        <FormItem className="flex items-center mt-3">
          <FormControl>
            <NumericInput
              register={form.register}
              name="currentEpisodeNo"
              className="w-fit p-1 text-right"
              maxLength={4}
              size={4}
              placeholder="_"
            />
          </FormControl>
          <FormLabel className="ml-2">
            {t("currentEpisode")}
          </FormLabel>
        </FormItem>

        <FormItem className="flex items-center mt-3">
          <FormControl>
            <NumericInput
              register={form.register}
              name="totalEpisodeCount"
              className="w-fit p-1 text-right"
              maxLength={4}
              size={4}
              placeholder="_"
            />
          </FormControl>
          <FormLabel className="ml-2">
            {t("expectingOrFinishedEpisode")}
          </FormLabel>
        </FormItem>

      </Row>
      {errors.currentEpisodeNo
        && <div className="text-sm font-medium text-destructive">
          {errors.currentEpisodeNo.message}
        </div>}
    </FieldSet>
  );
}

function MonthlyCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  return (
    <FieldSet>
      <legend>{t("monthlyProductionAvailableRounds")}</legend>
      <Row>

        <FormItem className="flex items-center mt-3">
          <FormControl>
            <NumericInput
              register={form.register}
              name="monthlyEpisodeCount"
              className="w-fit p-1 text-right"
              maxLength={4}
              size={4}
              placeholder="_"
            />
          </FormControl>
          <FormLabel className="ml-2">
            {t("episodesPossible")}
          </FormLabel>
        </FormItem>

      </Row>
    </FieldSet>
  );
}

function FinishedFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  return (
    <FieldSet>
      <legend>{t("serviceEpisodeInformation")}</legend>
      <Row>

        <FormItem className="flex items-center mt-3">
          <FormControl>
            <NumericInput
              register={form.register}
              name="totalEpisodeCount"
              className="w-fit p-1 text-right"
              maxLength={4}
              size={4}
              placeholder="_"
            />
          </FormControl>
          <FormLabel className="ml-2">
            {t("episodesCompleted")}
          </FormLabel>
        </FormItem>

      </Row>
    </FieldSet>
  );
}

function OriginalityFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
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
    <FieldSet>
      <legend>{t("serviceOnOtherPlatforms")}</legend>
      <BooleanFormField
        control={form.control}
        name="isOriginal"
        items={items}
        className="mt-3"
      />
    </FieldSet>
  );
}
