"use client";

import { Heading } from "@/shadcn/ui/texts";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";
import ContractRangeForm from "@/app/[locale]/webtoons/components/forms/ContractRangeForm";
import { Textarea } from "@/shadcn/ui/textarea";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { useForm } from "react-hook-form";
import { formResolver } from "@/utils/forms";
import { BidRequestFormSchema, BidRequestFormT } from "@/resources/bidRequests/bidRequest.types";
import { FieldSet, Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import Spinner from "@/components/Spinner";
import { createBidRequest } from "@/resources/bidRequests/bidRequest.service";
import { Row } from "@/shadcn/ui/layouts";


export default function BidRequestForm({ bidRoundId }: {
  bidRoundId: number;
}) {

  const tMakeAnOffer = useTranslations("makeAnOffer");
  const tGeneral = useTranslations("general");

  const form = useForm<BidRequestFormT>({
    defaultValues: {
      bidRoundId,
      contractRange: [],
      message: "",
    },
    mode: "onChange",
    resolver: (values) => formResolver(BidRequestFormSchema, values)
  });

  // Create a ref for the Heading component
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll to the Heading component when rendered
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [headingRef]);


  // 제출 이후 동작
  const { formState: { isValid, isSubmitting } } = form;
  const router = useRouter();
  const onSubmit = async (values: BidRequestFormT) => {
    await createBidRequest(values);
    router.replace("/offers");
  };

  // 스피너
  if (isSubmitting) {
    return <Spinner/>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Heading ref={headingRef}>
          {tMakeAnOffer("makeOffer")}
        </Heading>
        <ContractRangeForm form={form as never} formType="bidRequest"/>

        <FieldSet>
          <legend>
            {tMakeAnOffer("toCreator")}
          </legend>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormControl>
                  <Textarea
                    {...field}
                    // className="placeholder:text-white border-none"
                    placeholder={tMakeAnOffer("inputAdditionalRequirements")}
                    maxLength={10000}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <p className="text-[10pt] text-gray-shade mt-3">
            {tMakeAnOffer("note")}
          </p>
        </FieldSet>

        <Row className="mt-12">
          <Button
            className="ml-auto rounded-full"
            variant="secondary"
            disabled={!isValid}
          >
            <span className="gap-2">{tGeneral("submit")}</span>
            <IconRightBrackets className="fill-white"/>
          </Button>

        </Row>
      </form>
    </Form>
  );
}
