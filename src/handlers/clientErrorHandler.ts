import { InferIn, Schema } from "next-safe-action/adapters/types";
import { SafeActionResult } from "next-safe-action";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export function clientErrorHandler<
  ServerError,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
>(
  args: {
    error: Prettify<Omit<SafeActionResult<ServerError, S, BAS, CVE, CBAVE, Data>, "data">>;
    input: S extends Schema ? InferIn<S> : undefined;
  },
): void {
  console.log(args.error);
}

