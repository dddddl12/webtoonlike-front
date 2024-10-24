import { auth } from "@clerk/nextjs/server";
import { ClerkUserMetadata, ClerkUserMetadataSchema } from "@/utils/auth/base";
import { NotSignedInError } from "@/errors";

export const getClerkUser = async () => {
  const clerkUser = await auth();
  if (!clerkUser.userId) {
    throw new NotSignedInError();
  }
  return clerkUser;
};

export const getUserInfo = async (): Promise<ClerkUserMetadata> => {
  const clerkUser = await getClerkUser();
  return ClerkUserMetadataSchema.parse(clerkUser.sessionClaims.metadata);
};
