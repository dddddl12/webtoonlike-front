"use server";

import { InvoiceSchema } from "@/resources/invoices/invoice.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import z from "zod";
import { action } from "@/handlers/safeAction";
import invoiceService from "@/resources/invoices/invoice.service";

export const previewInvoice = action
  .metadata({ actionName: "previewInvoice" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [bidRequestId] }) => {
    return invoiceService.previewOrCreateInvoice(
      bidRequestId,
      false
    );
  });

export const createInvoice = action
  .metadata({ actionName: "createInvoice" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [bidRequestId] }) => {
    return invoiceService.previewOrCreateInvoice(
      bidRequestId,
      true
    );
  });

const InvoiceWithWebtoonSchema = InvoiceSchema
  .extend({
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
      thumbPath: z.string()
    }),
    creatorUsername: z.string(),
    buyerUsername: z.string()
  });
export type InvoiceWithWebtoonT = z.infer<typeof InvoiceWithWebtoonSchema>;

export const adminListInvoices = action
  .metadata({ actionName: "adminListInvoices" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(InvoiceWithWebtoonSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return invoiceService.list({
      ...filters,
      isAdmin: true
    });
  });

export const listInvoices = action
  .metadata({ actionName: "listInvoices" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(InvoiceWithWebtoonSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return invoiceService.list({
      ...filters,
      isAdmin: false
    });
  });

export const downloadInvoiceContent = action
  .metadata({ actionName: "downloadInvoiceContent" })
  .bindArgsSchemas([
    z.number() // invoiceId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [invoiceId] }) => {
    return invoiceService.download(invoiceId);
  });
