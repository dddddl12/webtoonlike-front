export type BidRequestMessageFormT = {
  bidRequestId: number;
  content: string;
}

export type BidRequestMessageT = {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  bidRequestId: number;
  content: string;
}

export type GetBidRequestMessageOptionT = {
  meId?: (number | undefined) | undefined;
}

export type ListBidRequestMessageOptionT = {
  cursor?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  $numData?: boolean | undefined;
  meId?: ((number | undefined) | undefined) | undefined;
  bidRequestId?: number | undefined;
}
