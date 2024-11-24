"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponseSchema } from "@/resources/globalTypes";
import invoiceService from "@/resources/invoices/services/invoice.service";
import { InvoiceWithWebtoonSchema } from "@/resources/invoices/dtos/invoice.dto";

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

