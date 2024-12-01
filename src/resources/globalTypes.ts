import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/binary";
import z from "zod";

export type ListResponse<T> = {
  items: T[];
  totalPages: number;
};
export const ListResponseSchema = (itemSchema: z.ZodTypeAny) => z.object({
  items: z.array(itemSchema),
  totalPages: z.number(),
});

export const PaginationSchema = z.object({
  page: z.number().default(1),
});

export const ResourceSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PrismaTransaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export const BusinessFieldSchema = z.enum([
  "WEBTOONS",
  "TV_SHOWS",
  "WEB_SERIES",
  "MOVIES",
  "ADS",
  "MUSICALS",
  "PLAYS",
  "GAMES",
  "BOOKS",
  "GOODS",
  "WEB_NOVELS",
  "MUSIC",
  "NFT",
  "CHARACTERS",
  "OTHER"
]);

export const CountrySchema = z.enum([
  "ALL",
  "KR",
  "US",
  "CN",
  "TW",
  "FR",
  "DE",
  "ID",
  "TH",
  "VN",
  "MY",
  "ES",
  "JP",
  "OTHER",
]);
