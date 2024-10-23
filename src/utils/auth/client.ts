import { useUser } from "@clerk/nextjs";
import { ClerkUserMetadata, ClerkUserMetadataSchema } from "@/utils/auth/base";

export function useUserInfo(): {
  user?: ClerkUserMetadata;
  isLoaded: boolean;
} {
  const clerkUseUserReturn = useUser();
  if (!clerkUseUserReturn.isLoaded) {
    return {
      isLoaded: false,
    };
  }
  const metadata = clerkUseUserReturn.user?.publicMetadata;
  const { data } = ClerkUserMetadataSchema.safeParse(metadata);
  return {
    isLoaded: true,
    user: data
  };
}
