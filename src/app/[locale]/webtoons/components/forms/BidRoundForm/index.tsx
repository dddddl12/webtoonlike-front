"use client";

import { useState } from "react";
import { Heading2 } from "@/shadcn/ui/texts";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { useTranslations } from "next-intl";
import { BidRoundFormSchema, BidRoundFormT, BidRoundT } from "@/resources/bidRounds/bidRound.types";
import { useForm, UseFormReturn, FieldValues, FieldPath, FieldPathValue, useWatch } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import BidRoundFormContractRange from "@/app/[locale]/webtoons/components/forms/BidRoundForm/BidRoundFormContractRange";
import { FieldSet, Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import Spinner from "@/components/Spinner";
import { updateBidRound } from "@/resources/bidRounds/bidRound.service";
import { formResolver } from "@/utils/forms";

export default function BidRoundForm({ webtoonId, prev }: {
  webtoonId: number
  prev?: BidRoundT
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const [isAgreed, setIsAgreed] = useState(false);
  const form = useForm<BidRoundFormT>({
    defaultValues: {
      webtoonId,
      contractRange: prev?.contractRange,
      isOriginal: prev?.isOriginal,
      isNew: prev?.isNew,
      totalEpisodeCount: prev?.totalEpisodeCount,
      currentEpisodeNo: prev?.currentEpisodeNo,
      monthlyEpisodeCount: prev?.monthlyEpisodeCount,
    },
    mode: "onChange",
    resolver: (values) => {
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
              message: t("currentEpisodeNoMustBeLessThanTotal")
            },
          }
        };
      }
      return formResolver(BidRoundFormSchema, values);
    }
  });

  // 조건부 필드
  const isNew = useWatch({
    control: form.control,
    name: "isNew"
  });

  // 제출 이후 동작
  const { formState: { isSubmitting, isValid } } = form;
  const router = useRouter();
  async function onSubmit(values: BidRoundFormT) {
    await updateBidRound(values);
    // TODO
    if (prev) {
      router.replace(`/webtoons/${webtoonId}`);
    } else {
      router.replace("/webtoons");
    }
  }

  // 스피너
  if (isSubmitting) {
    return <Spinner/>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            disabled={!isValid || !isAgreed}
            type="submit"
            className="rounded-full bg-mint text-white"
          >
            {t("register")}
            <IconRightBrackets className="fill-white"/>
          </Button>
        </Row>

      </form>
    </Form>
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
    <FieldSet>
      <legend>{t("productType")}</legend>
      <BooleanFormItem
        form={form}
        fieldName="isNew"
        items={items}
      />
    </FieldSet>
  );
}


function EpisodeCountFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const { errors } = form.formState;

  return (
    <FieldSet>
      <legend>{t("serialInformation")}</legend>
      <Row className="gap-4">
        <NumericFormItem
          form={form}
          fieldName="currentEpisodeNo"
          unitName={t("currentEpisode")}
        />
        <NumericFormItem
          form={form}
          fieldName="totalEpisodeCount"
          unitName={t("expectingOrFinishedEpisode")}
        />
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
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <FieldSet>
      <legend>{t("monthlyProductionAvailableRounds")}</legend>
      <Row>
        <NumericFormItem
          form={form}
          fieldName="monthlyEpisodeCount"
          unitName={t("episodesPossible")}
        />
      </Row>
    </FieldSet>
  );
}

function FinishedFieldSet({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  return (
    <FieldSet>
      <legend>{t("serialInformation")}</legend>
      <Row>
        <NumericFormItem
          form={form}
          fieldName="totalEpisodeCount"
          unitName={t("finishedEpisode")}
        />
      </Row>
    </FieldSet>
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
    <FieldSet>
      <legend>{t("SerializationOfOtherPlatforms")}</legend>
      <BooleanFormItem
        form={form}
        fieldName="isOriginal"
        items={items}
      />
    </FieldSet>
  );
}

type FieldName<TFieldValues extends FieldValues, AllowedFieldType> = {
  [K in FieldPath<TFieldValues>]: FieldPathValue<TFieldValues, K> extends AllowedFieldType | undefined ? K : never;
}[FieldPath<TFieldValues>];

function NumericFormItem<TFieldValues extends FieldValues>({ form, fieldName, unitName }: {
  form: UseFormReturn<TFieldValues>;
  fieldName: FieldName<TFieldValues, number>;
  unitName: string;
}) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const field = form.register(fieldName, {
    setValueAs: (rawInput) => {
      const intValue = parseInt(rawInput);
      if (intValue >= 0) {
        setDisplayValue(intValue.toString());
        return intValue;
      } else if (!rawInput) {
        setDisplayValue("");
      }
    }
  });
  return <FormItem className="flex items-center mt-3">
    <FormControl>
      <Input
        {...field}
        className="w-fit p-1 text-right"
        type="text"
        maxLength={4}
        size={4}
        value={displayValue}
        placeholder="_"
      />
    </FormControl>
    <FormLabel className="ml-2">
      {unitName}
    </FormLabel>
  </FormItem>;
}


function BooleanFormItem<TFieldValues extends FieldValues>({ form, fieldName, items }: {
  form: UseFormReturn<TFieldValues>;
  fieldName: FieldName<TFieldValues, boolean>;
  items: {
    value: boolean;
    label: string;
  }[];
}) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="mt-3">
          <FormControl>
            <RadioGroup
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
  );
}
