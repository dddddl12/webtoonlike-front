import { useUser } from "@clerk/nextjs";
import { ClerkUserMetadata, ClerkUserMetadataSchema } from "@/resources/userMetadata/userMetadata.types";

export function useUserMetadata(): {
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
