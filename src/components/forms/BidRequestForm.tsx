"use client";

import { Heading } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";
import ContractRangeForm from "@/components/forms/ContractRangeForm";
import { Textarea } from "@/shadcn/ui/textarea";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { BidRequestFormSchema } from "@/resources/bidRequests/dtos/bidRequest.dto";
import { FieldSet, Form, FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { createBidRequest } from "@/resources/bidRequests/controllers/bidRequest.controller";
import { Row } from "@/components/ui/common";
import { useToast } from "@/shadcn/hooks/use-toast";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";


export default function BidRequestForm({ bidRoundId }: {
  bidRoundId: number;
}) {

  const tMakeAnOffer = useTranslations("offerDetails");
  const tGeneral = useTranslations("general");
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, handleSubmitWithAction }
    = useSafeHookFormAction(
      createBidRequest.bind(null, bidRoundId),
      zodResolver(BidRequestFormSchema),
      {
        actionProps: {
          onSuccess: () => {
            toast({
              description: "오퍼를 보냈습니다."
            });
            router.replace("/offers");
          },
          onError: () => setIsSubmitting(false)
        },
        formProps: {
          mode: "onChange",
        }
      });


  // Create a ref for the Heading component
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll to the Heading component when rendered
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [headingRef]);

  const { formState: { isValid } } = form;
  return (
    <Form {...form}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await handleSubmitWithAction(e);
      }} className={clsx({
        "form-overlay": isSubmitting
      })}>
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
