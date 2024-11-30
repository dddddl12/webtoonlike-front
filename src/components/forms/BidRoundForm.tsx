"use client";

import { useState } from "react";
import { Heading2 } from "@/components/ui/common";
import { Row } from "@/components/ui/common";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { useTranslations } from "next-intl";
import { BidRoundFormSchema, BidRoundFormT, BidRoundT } from "@/resources/bidRounds/dtos/bidRound.dto";
import { ControllerRenderProps, FieldPath, FieldValues, UseFormReturn, useWatch } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/shadcn/ui/form";
import ContractRangeForm, { FormT } from "@/components/forms/ContractRangeForm";
import { NumericInput } from "@/shadcn/ui/input";
import { createOrUpdateBidRound } from "@/resources/bidRounds/controllers/bidRound.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import useSafeActionForm from "@/hooks/safeActionForm";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import SubmitButton from "@/components/ui/form/SubmitButton";

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
            router.replace(`/webtoons/${webtoonId}`, {
              scroll: true
            });
          } else {
            router.replace("/webtoons", {
              scroll: true
            });
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
    <Form {...form} schema={BidRoundFormSchema}>
      <form onSubmit={onSubmit} className={clsx({
        "form-overlay": isFormSubmitting
      })}>
        {/* 기본 정보 */}
        <Heading2>
          {t("generalInformation")}
          <IconExclamation className="ml-1"/>
        </Heading2>

        <div className="space-y-6">

          <IsNewField form={form}/>

          {isNew
            ? (
              <>
                <EpisodeCountFieldSet form={form} />
                <MonthlyCountFieldSet form={form}/>
              </>
            ) : <FinishedFieldSet form={form}/>}

          <OriginalityField form={form}/>

        </div>

        {/* 계약 상세 */}
        <Heading2>
          {t("form.currentStatusOfCopyrightAgreement")}
          <IconExclamation className="ml-1"/>
        </Heading2>

        <ContractRangeForm form={form as UseFormReturn<FormT>} formType="bidRound"/>

        {/* 동의 박스 */}
        <FormItem className="justify-center mt-16" forcedIsInline={true}>
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
        <SubmitButton
          disabled={!isValid || !isAgreed || !isDirty}
          isNew={!prev}/>
      </form>
    </Form>
  );
}


function IsNewField({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  return (
    <FormField
      control={form.control}
      name={"isNew"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("seriesType")}</FormLabel>
          <BooleanFormControl
            field={field}
            items={[
              {
                value: true,
                label: t("newWork"),
              },
              {
                value: false,
                label: t("oldWork"),
              }
            ]}
          />
          <FormMessage/>
        </FormItem>
      )}
    />
  );
}


function EpisodeCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  const { errors } = form.formState;

  return (
    <fieldset>
      <Label>{t("serviceEpisodeInformation")}</Label>
      <Row className="gap-4">

        <FormItem forcedIsInline={true}>
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
          <FormLabel>
            {t("currentEpisode")}
          </FormLabel>
        </FormItem>

        <FormItem forcedIsInline={true}>
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
          <FormLabel>
            {t("expectingOrFinishedEpisode")}
          </FormLabel>
        </FormItem>

      </Row>
      {errors.currentEpisodeNo
        && <div className="text-sm font-medium text-destructive">
          {errors.currentEpisodeNo.message}
        </div>}
    </fieldset>
  );
}

function MonthlyCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  return (
    <fieldset>
      <Label>{t("monthlyProductionAvailableRounds")}</Label>

      <FormItem forcedIsInline={true}>
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
        <FormLabel>
          {t("episodesPossible")}
        </FormLabel>
      </FormItem>

    </fieldset>
  );
}

function FinishedFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  return (
    <fieldset>
      <Label>{t("serviceEpisodeInformation")}</Label>

      <FormItem forcedIsInline={true}>
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
        <FormLabel>
          {t("episodesCompleted")}
        </FormLabel>
      </FormItem>

    </fieldset>
  );
}

function OriginalityField({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("bidRoundDetails");
  return <FormField
    control={form.control}
    name={"isOriginal"}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t("seriesType")}</FormLabel>
        <BooleanFormControl
          field={field}
          items={[
            {
              value: true,
              label: t("yes"),
            },
            {
              value: false,
              label: t("no"),
            }
          ]}
        />
        <FormMessage/>
      </FormItem>
    )}
  />;
}

function BooleanFormControl<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ field, items }: {
  field: ControllerRenderProps<TFieldValues, TName>;
  items: {
    value: boolean;
    label: string;
  }[];
}) {
  return <RadioGroup
    {...field}
    value={field.value?.toString() || ""}
    className="flex flex-wrap gap-3"
    onValueChange={(value) => {
      field.onChange(JSON.parse(value));
    }}
    onChange={undefined}
  >
    {items.map((item, index) => (
      <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
        <FormControl>
          <RadioGroupItem
            value={item.value.toString()}
          />
        </FormControl>
        <FormLabel>
          {item.label}
        </FormLabel>
      </FormItem>
    ))}
  </RadioGroup>;
}