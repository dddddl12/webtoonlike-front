import { getCookie, setCookie, deleteCookie } from "cookies-next";

class TokenHolder {

  token: string | null = null;
  sessionKey = "__session";

  constructor() {
    this.token = null;
  }


  getTokenFromDocument(cookieString: string): string | null {
    if (typeof document == "undefined") {
      return null;
    }
    const cookies = cookieString.split(";").map(cookie => cookie.trim());

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === this.sessionKey) {
        return value;
      }
    }

    return null; // Cookie not found
  }

  async serverFetchWithCredential<T>(cookies: any, fn: (...args: any[]) => Promise<T>): Promise<T> {
    if (typeof window !== "undefined") {
      throw new Error("serverFetchWithCookie should be called in server side only");
    }
    // setup cookies if exists
    const cached = getCookie(this.sessionKey, { cookies });
    if (cached) {
      this.token = cached;
    }

    // run functions
    try {
      const result = await fn();
      return result;
    } catch (e) {
      throw e;
    } finally {
      this.token = null;
    }

  }
}

export const tokenHolder = new TokenHolder();