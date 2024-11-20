import z from "zod";
import { ResolverResult } from "react-hook-form";

// todo zodResolver로 대체
export function formResolver<T extends z.Schema<any, any>>(
  zodSchema: T,
  values: z.infer<T>
): ResolverResult<z.infer<T>> {
  const { success, data } = zodSchema
    .transform((obj) => {
      // 값이 없으면 DB에 null로 저장하여 헷갈리는 일 없도록 할 것
      for (const [key, value] of Object.entries(obj)) {
        if (value === "") {
          delete obj[key];
        }
      }
      return obj;
    })
    .safeParse(values);

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
