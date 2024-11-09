import z from "zod";
import { Resolver } from "react-hook-form";

export function formResolver<T extends z.ZodRawShape>(
  zodSchema: z.ZodObject<T>,
  values: z.infer<z.ZodObject<T>>
): ReturnType<Resolver<z.ZodObject<T>>> {
  const { success, data } = zodSchema.safeParse(values);
  if (success) {
    return {
      values: data,
      errors: {}
    };
  } else {
    return {
      values: {},
      errors: {
        root: {
          "type": "zodValidationFailed",
          "message": "Zod validation failed",
        }
      }
    };
  }
}
