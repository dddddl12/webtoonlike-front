import z from "zod";

type ValuesType = {
  originality: "original" | "notOriginal";
  episodeNow?: string;
  episodeDone?: string;
  possibleToMake?: string;
  contractType?: "serialRights" | "businessRights";
  otherPlatform?: "true" | "false";
  [key: string]: string | undefined;
};

export const creatBidRoundSchema = z.object({
  originality: z.enum(["original", "notOriginal"]),
  episodeNow: z.string().optional(),
  episodeDone: z.string().optional(),
  possibleToMake: z.string().optional(),
  contractType: z.enum(["serialRights", "businessRights"]).optional(),
  otherPlatform: z.enum(["true", "false"]).optional(),
}).superRefine((values: ValuesType, ctx) => {
  const originalFields = ["episodeNow", "episodeDone", "possibleToMake", "contractType"];
  const notOriginalFields = ["episodeDone", "otherPlatform", "contractType"];

  if (values.originality === "original") {
    for (const field of originalFields) {
      if (!values[field]) {
        ctx.addIssue({
          message: "필수 입력",
          code: z.ZodIssueCode.custom,
          path: [field],
        });
      }
    }
  }

  if (values.originality === "notOriginal") {
    for (const field of notOriginalFields) {
      if (!values[field]) {
        ctx.addIssue({
          message: "필수 입력",
          code: z.ZodIssueCode.custom,
          path: [field],
        });
      }
    }
  }
});

export type CreatBidRoundT = z.infer<typeof creatBidRoundSchema>;