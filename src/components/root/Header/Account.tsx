"use client";

import { Link } from "@/i18n/routing";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export function Account() {
  const Tinquiry = useTranslations("inquiryMenu");

  return <>
    <SignedOut>
      <Link className="bg-white text-black font-bold p-2 rounded-[4px] cursor-pointer" href={"/sign-in"}>
        {Tinquiry("login")}
      </Link>
    </SignedOut>
    <SignedIn>
      <UserButton/>
    </SignedIn>
  </>;
}