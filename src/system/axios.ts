import axios from "axios";
import { API_URL } from "@/config";
import { tokenHolder } from "./token_holder";

export type AxiosOptions = {
  headers?: { [key: string]: string };
};

export const server = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});


server.interceptors.request.use(
  async (req) => {

    if (typeof document !== "undefined") {
      const sessionCookie = tokenHolder.getTokenFromDocument(document.cookie ?? "");

      if (sessionCookie) {
        req.headers["Authorization"] = `${sessionCookie}`;
      }
    } else {
      if (tokenHolder.token) {
        req.headers["Authorization"] = `${tokenHolder.token}`;
      }
    }
    return req;
  },
  (err) => err,
);

