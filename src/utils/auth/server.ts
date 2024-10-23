import { auth } from "@clerk/nextjs/server";
import { ClerkUserMetadata, ClerkUserMetadataSchema } from "@/utils/auth/base";
import { SignedInAuthObject } from "@clerk/backend/internal";
import { NotSignedInError } from "@/errors";

export const getClerkUser = async (): Promise<SignedInAuthObject> => {
  const clerkUser = await auth();
  if (!clerkUser.userId) {
    throw new NotSignedInError();
  }
  return clerkUser;
};

export const getServerUserInfo = async (): Promise<ClerkUserMetadata> => {
  const clerkUser = await getClerkUser();
  return ClerkUserMetadataSchema.parse(clerkUser.sessionClaims.metadata);
};
