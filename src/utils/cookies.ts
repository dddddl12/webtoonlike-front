import { cookies } from "next/headers";
import { authCookieName } from "@/utils/authedUser";

export const getCookieValue = (name: string) => cookies().get(authCookieName)?.value;
