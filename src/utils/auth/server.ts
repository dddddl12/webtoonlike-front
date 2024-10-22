import { auth } from "@clerk/nextjs/server";
import { ClerkUserMetadata, ClerkUserMetadataSchema } from "@/utils/auth/base";
import { SignedInAuthObject } from "@clerk/backend/internal";
import { NotSignedInError } from "@/errors";

export const getClerkUser = (): SignedInAuthObject => {
  const clerkUser = auth();
  if (!clerkUser.userId) {
    throw new NotSignedInError();
  }
  return clerkUser;
};

export const getServerUserInfo = (): ClerkUserMetadata => {
  const clerkUser = getClerkUser();
  return ClerkUserMetadataSchema.parse(clerkUser.sessionClaims.metadata);
};
