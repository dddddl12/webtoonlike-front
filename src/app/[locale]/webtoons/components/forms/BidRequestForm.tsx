"use client";

import { Heading } from "@/shadcn/ui/texts";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";
import ContractRangeForm from "@/app/[locale]/webtoons/components/forms/ContractRangeForm";
import { Textarea } from "@/shadcn/ui/textarea";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { formResolver } from "@/utils/forms";
import { BidRequestFormSchema } from "@/resources/bidRequests/bidRequest.types";
import { FieldSet, Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import Spinner from "@/components/Spinner";
import { createBidRequest } from "@/resources/bidRequests/bidRequest.service";
import { Row } from "@/shadcn/ui/layouts";
import { useToast } from "@/shadcn/hooks/use-toast";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";


export default function BidRequestForm({ bidRoundId }: {
  bidRoundId: number;
}) {

  const tMakeAnOffer = useTranslations("offerDetails");
  const tGeneral = useTranslations("general");
  const { toast } = useToast();
  const router = useRouter();


  const { form, handleSubmitWithAction }
    = useSafeHookFormAction(
      createBidRequest.bind(null, bidRoundId),
      (values) => formResolver(BidRequestFormSchema, values),
      {
        actionProps: {
          onSuccess: () => {
            toast({
              description: "오퍼를 보냈습니다."
            });
            router.replace("/offers");
          }
        },
        formProps: {
          defaultValues: {
            contractRange: [],
            message: "",
          },
          mode: "onChange",
        }
      });


  // Create a ref for the Heading component
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll to the Heading component when rendered
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [headingRef]);


  // 제출 이후 동작
  const { formState: { isValid, isSubmitting, isSubmitSuccessful } } = form;

  // 스피너
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner/>;
  }

  return (
    <Form {...form}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmitWithAction(e);
      }}>
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
            {tGeneral("submit")}
            <IconRightBrackets />
          </Button>

        </Row>
      </form>
    </Form>
  );
}
