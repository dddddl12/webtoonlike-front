import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { NotSignedInError } from "@/handlers/errors";

export const useTokenRefresh = () => {
  const { isSignedIn, session } = useSession();
  // 시작 시 트리거
  const [refreshRequested, setRefreshRequested] = useState(false);
  // 종료 시 트리거
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  useEffect(() => {
    if (isSignedIn === false) {
      throw new NotSignedInError();
    }
    if (session && refreshRequested) {
      session.touch().then(() => setTokenRefreshed(true));
    }
  }, [isSignedIn, session, refreshRequested]);

  return {
    tokenRefreshed,
    startRefresh: () => setRefreshRequested(true),
  };
};
