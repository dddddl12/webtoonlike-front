import useSafeActionForm from "@/hooks/safeActionForm";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Heading1, Row } from "@/components/ui/common";
import ContractRangeForm from "@/components/forms/ContractRangeForm";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { OfferProposalFormSchema } from "@/resources/offers/dtos/offerProposal.dto";

export default function FormWrapper(safeActionFormReturn: ReturnType<typeof useSafeActionForm>) {
  const tMakeAnOffer = useTranslations("offerDetails");
  const tGeneral = useTranslations("general");

  const { isFormSubmitting, form, onSubmit } = safeActionFormReturn;

  // Create a ref for the Heading component
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll to the Heading component when rendered
  useEffect(() => {
    headingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    //   todo 재분석
    });
  }, [headingRef]);

  const { formState: { isValid, isDirty } } = form;
  return (
    <Form {...form} schema={OfferProposalFormSchema}>
      <form onSubmit={onSubmit} className={clsx({
        "form-overlay": isFormSubmitting
      })}>
        <Heading1 ref={headingRef}>
          {tMakeAnOffer("makeOffer")}
        </Heading1>
        <ContractRangeForm form={form} formType="offerProposal"/>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mt-8">
              <FormLabel>
                {tMakeAnOffer("toCreator")}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={tMakeAnOffer("inputAdditionalRequirements")}
                  maxLength={10000}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground mt-3">
          {tMakeAnOffer("note")}
        </p>

        <Row className="mt-12">
          <Button
            className="ml-auto rounded-full"
            variant="secondary"
            disabled={!isValid || !isDirty}
          >
            {tGeneral("submit")}
            <IconRightBrackets />
          </Button>

        </Row>
      </form>
    </Form>
  );
}
