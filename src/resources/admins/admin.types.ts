import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

export const AdminBaseSchema = z.object({
  isSuper: z.boolean(),
});

export const AdminSchema = AdminBaseSchema
  .merge(ResourceSchema);