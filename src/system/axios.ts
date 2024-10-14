"use server";

import axios from "axios";
import { API_URL } from "@/config";
import { auth } from "@clerk/nextjs/server";

export const server = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});


server.interceptors.request.use(
  async (req) => {
    req.headers["Authorization"] = await auth().getToken(); //TODO delay 검증
    return req;
  },
  (err) => console.log("Request failed", err),
);

server.interceptors.response.use(
  async (res) => res,
  (err) => console.log("Request failed", err)
);
