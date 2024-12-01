"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponseSchema, PaginationSchema } from "@/resources/globalTypes";
import invoiceService from "@/resources/invoices/services/invoice.service";
import { InvoicedOfferSchema, UninvoicedOfferSchema } from "@/resources/invoices/dtos/invoice.dto";

export const adminListUninvoicedOffers = action
  .metadata({ actionName: "adminListUninvoicedOffers" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(UninvoicedOfferSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return invoiceService.list({
      ...filters,
      isAdmin: true,
      mode: "uninvoiced"
    });
  });

export const adminListInvoicedOffers = action
  .metadata({ actionName: "adminListInvoicedOffers" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(InvoicedOfferSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return invoiceService.list({
      ...filters,
      isAdmin: true,
      mode: "invoiced"
    });
  });

export const listUninvoicedOffers = action
  .metadata({ actionName: "listUninvoicedOffers" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(UninvoicedOfferSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return invoiceService.list({
      ...filters,
      isAdmin: false,
      mode: "uninvoiced"
    });
  });

export const listInvoicedOffers = action
  .metadata({ actionName: "listInvoicedOffers" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(InvoicedOfferSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return invoiceService.list({
      ...filters,
      isAdmin: false,
      mode: "invoiced"
    });
  });

