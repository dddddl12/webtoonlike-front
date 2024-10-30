import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { ZodObject, z } from "zod";

export const useAllRequiredFilled = (
  form: UseFormReturn<any>,
  schema: ZodObject<any>
) => {
  const allValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  useEffect(() => {
    const { success } = schema.safeParse(allValues);
    setAllRequiredFilled(success);
  }, [allValues]);
  return allRequiredFilled;
};