import useSafeActionForm from "@/hooks/safeActionForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Heading1 } from "@/components/ui/common";
import ContractRangeForm from "@/components/forms/ContractRangeForm";
import { Textarea } from "@/shadcn/ui/textarea";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { OfferProposalFormSchema } from "@/resources/offers/dtos/offerProposal.dto";
import SubmitButton from "@/components/ui/form/SubmitButton";

export default function FormWrapper(safeActionFormReturn: ReturnType<typeof useSafeActionForm>) {
  const tMakeAnOffer = useTranslations("offerDetails");

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
              <FormMessage/>
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground mt-3">
          {tMakeAnOffer("note")}
        </p>

        <SubmitButton
          disabled={!isValid || !isDirty}
          isNew={true}/>
      </form>
    </Form>
  );
}
