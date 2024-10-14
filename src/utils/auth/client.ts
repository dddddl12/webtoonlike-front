import { ClerkUserMetadata } from "@/types";
import { getUserInfo, UserInfo } from "@/utils/auth/base";
import { UserResource } from "@clerk/types";

type ClerkUseUserReturn = {
    isLoaded: false;
    isSignedIn: undefined;
    user: undefined;
} | {
    isLoaded: true;
    isSignedIn: false;
    user: null;
} | {
    isLoaded: true;
    isSignedIn: true;
    user: UserResource;
};


export const getClientUserInfo = (useUserReturn: ClerkUseUserReturn): UserInfo => {
  const metadata = useUserReturn.isSignedIn
    ? useUserReturn.user.publicMetadata as ClerkUserMetadata
    : undefined;
  return getUserInfo(metadata);
};

