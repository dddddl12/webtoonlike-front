"use server";

import {
  BidRequestMessageSchema,
} from "@/resources/bidRequestMessages/bidRequestMessage.dto";
import prisma from "@/utils/prisma";
import { UserSchema, UserTypeT } from "@/resources/users/dtos/user.dto";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { InvoiceSchema } from "@/resources/invoices/dtos/invoice.dto";
import z from "zod";
import { action } from "@/handlers/safeAction";

const BidRequestMessagesResponseSchema = z.object({
  messages: z.array(
    BidRequestMessageSchema.extend({
      user: UserSchema.pick({
        id: true,
        name: true,
        userType: true
      })
    })
  ),
  invoice: InvoiceSchema.pick({
    id: true,
    createdAt: true,
  }).optional()
});
export type BidRequestMessagesResponseT = z.infer<typeof BidRequestMessagesResponseSchema>;

export const listBidRequestMessages = action
  .metadata({ actionName: "listBidRequestMessages" })
  .bindArgsSchemas([
    z.number() // bidRequestId
  ])
  .outputSchema(
    BidRequestMessagesResponseSchema
  )
  .action(
    async ({
      bindArgsParsedInputs: [bidRequestId],
    }) => {
      const [records, invoiceRecord] = await prisma.$transaction([
        prisma.bidRequestMessage.findMany({
          where: {
            bidRequestId
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                userType: true
              }
            },
            bidRequest: {
              select: {
                invoice: {
                  select: {
                    id: true,
                    createdAt: true
                  }
                }
              }
            }
          }
        }),
        prisma.invoice.findUnique({
          where: { bidRequestId }
        })
      ]);
      const bidRequestMessagesResponse: BidRequestMessagesResponseT = {
        messages: records.map(record => {
          const { user } = record;
          return {
            id: record.id,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            bidRequestId: record.bidRequestId,
            content: record.content,
            user: {
              id: user.id,
              userType: user.userType as UserTypeT,
              name: user.name
            }
          };
        })
      };
      if (invoiceRecord){
        bidRequestMessagesResponse.invoice = {
          id: invoiceRecord.id,
          createdAt: invoiceRecord.createdAt,
        };
      }
      return bidRequestMessagesResponse;
    }
  );

export const createBidRequestMessage = action
  .metadata({ actionName: "createBidRequestMessage" })
  .bindArgsSchemas([
    z.number() // bidRequestId
  ])
  .schema(z.object({
    content: z.string()
  }))
  .action(
    async ({
      bindArgsParsedInputs: [bidRequestId],
      parsedInput: { content }
    }) => {
      const { userId } = await getTokenInfo();
      await prisma.bidRequestMessage.create({
        data: {
          bidRequestId,
          content,
          userId
        }
      });
    });
