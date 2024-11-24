"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import invoiceContentService from "@/resources/invoices/services/invoiceContent.service";

export const previewInvoice = action
  .metadata({ actionName: "previewInvoice" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [bidRequestId] }) => {
    return invoiceContentService.previewOrCreateInvoice(
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
    return invoiceContentService.previewOrCreateInvoice(
      bidRequestId,
      true
    );
  });

export const downloadInvoiceContent = action
  .metadata({ actionName: "downloadInvoiceContent" })
  .bindArgsSchemas([
    z.number() // invoiceId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [invoiceId] }) => {
    return invoiceContentService.download(invoiceId);
  });
