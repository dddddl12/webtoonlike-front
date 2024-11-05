import { useUser } from "@clerk/nextjs";
import { TokenInfo, TokenInfoSchema } from "@/resources/tokens/token.types";

export function useTokenInfo(): {
  tokenInfo?: TokenInfo;
  isLoaded: boolean;
} {
  const clerkUseUserReturn = useUser();
  if (!clerkUseUserReturn.isLoaded) {
    return {
      isLoaded: false,
    };
  } else if (!clerkUseUserReturn.user) {
    return {
      isLoaded: true,
    };
  }
  const { publicMetadata, externalId } = clerkUseUserReturn.user;
  const { data } = TokenInfoSchema.safeParse({
    userId: externalId,
    metadata: publicMetadata
  });
  return {
    isLoaded: true,
    tokenInfo: data
  };
}
