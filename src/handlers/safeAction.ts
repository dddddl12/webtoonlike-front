import { createSafeActionClient } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { z } from "zod";
import { ExpectedError } from "@/handlers/errors";

export type ActionError = {
  name: string;
  message?: string;
};

export const action = createSafeActionClient({
  validationAdapter: zodAdapter(),
  handleServerError: (e): ActionError => {
    if (!(e instanceof ExpectedError)) {
      throw e;
    }
    return {
      name: e.name,
      message: e.message,
    };
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
}).use(async ({ next, metadata, clientInput, bindArgsClientInputs, ctx }) => {
  // Here we use a logging middleware.
  const start = Date.now();

  // Here we await the next middleware.
  const result = await next();

  const end = Date.now();

  const durationInMs = end - start;

  const logObject: Record<string, any> = { durationInMs };

  logObject.clientInput = clientInput;
  logObject.bindArgsClientInputs = bindArgsClientInputs;
  logObject.metadata = metadata;
  logObject.result = result;

  console.log("LOGGING FROM MIDDLEWARE: " + logObject.metadata.actionName);
  console.dir(logObject, { depth: null });

  // And then return the result of the awaited next middleware.
  return result;
});
