import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { enUS, koKR } from "@clerk/localizations";
import { Footer } from "@/components/root/Footer";
import { Header } from "@/components/root/Header";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/shadcn/ui/toaster";
import Alert from "@/components/root/Alert";
import { updateTokenInfo } from "@/resources/tokens/token.service";
import SignUpComplete from "@/components/root/SignUpComplete";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Webtoon Like",
  description: "The Place where your IP becomes stock.",
  openGraph: {
    images: ["/img/og.png"],
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  const { signUpFinished, signedInToClerk } = await updateTokenInfo();
  return (
    <html lang={locale}>
      <ClerkProvider localization={locale === "en" ? enUS : koKR}>
        <NextIntlClientProvider messages={messages}>
          <body className={`${inter.className} min-h-screen flex flex-col`}>
            <Header/>
            <main className="flex-grow flex">
              {/*Clerk에 로그인되었으나 DB에 유저 정보가 없는 경우 sign up 마무리시킬 것*/}
              {(!signUpFinished && signedInToClerk)
                ? <SignUpComplete/> : children}
            </main>
            <Footer/>
            <Toaster/>
            <Alert/>
          </body>
        </NextIntlClientProvider>
      </ClerkProvider>
    </html>
  );
}
