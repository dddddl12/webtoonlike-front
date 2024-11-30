import { createSafeActionClient, ServerErrorFunctionUtils } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { z } from "zod";
import { ActionErrorT, ExpectedServerError, NotFoundError, UnexpectedServerError } from "@/handlers/errors";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";

const MetadataSchema = z.object({
  actionName: z.string(),
});

export const action = createSafeActionClient({
  validationAdapter: zodAdapter(),
  defineMetadataSchema: () => MetadataSchema,
  handleServerError: async (e, serverErrorFunctionUtils): Promise<ActionErrorT> => {
    if (e instanceof ExpectedServerError) {
      if (e.logError) {
        logError(e, serverErrorFunctionUtils);
      }
      return {
        httpCode: e.httpCode,
        name: e.name,
        title: e.title,
        message: e.message,
      };
    }

    const t = await getTranslations("errors");
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma DB 관련 공통 에러 처리
      switch (e.code) {
        case "P2025":
          return {
            httpCode: 404,
            name: NotFoundError.name,
            title: t("NotFoundError.title"),
            message: t("NotFoundError.message"),
          };
      }
    }

    // 예상 에러로 걸러내지 못한 경우
    logError(e, serverErrorFunctionUtils);
    return {
      httpCode: 500,
      name: UnexpectedServerError.name,
      title: t("UnexpectedError.title"),
      message: t("UnexpectedError.message"),
    };
  },
}).use(async ({ next, metadata, clientInput, bindArgsClientInputs }) => {
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
  console.dir(logObject, { departmenth: null });

  // And then return the result of the awaited next middleware.
  return result;
});


const logError = (error: Error, serverErrorFunctionUtils: ServerErrorFunctionUtils<typeof MetadataSchema>) => {
  const { metadata: { actionName },
    clientInput, bindArgsClientInputs } = serverErrorFunctionUtils;
  console.error(`[에러 발생]: ${error.message} `, {
    actionName,
    clientInput,
    bindArgsClientInputs,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  });
};