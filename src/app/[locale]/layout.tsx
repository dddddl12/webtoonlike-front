import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RecoilProvider } from "@/components/$providers/RecoilProvider";
import "./globals.css";
import { AOSInit } from "@/ui/AOS";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { enUS, koKR } from "@clerk/localizations";
import { SnackbarProvider } from "@/hooks/Snackbar";
import { ConfirmDialogShared } from "@/hooks/ConfirmDialog";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "webtoonLikes",
  description: "웹툰 오퍼 플랫폼 웹툰라이크",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  const currentLocale = useLocale();
  return (
    <ClerkProvider localization={currentLocale === "en" ? enUS : koKR}>
      <RecoilProvider>
        <html lang={locale} className="h-[100%]">
          {/*TODO 필요한지 확인*/}
          <AOSInit />
          <NextIntlClientProvider messages={messages}>
            <body className={`h-[100%] ${inter.className}`}>
              {/*TODO 필요한지 확인*/}
              <ConfirmDialogShared />
              <SnackbarProvider>
                <Header/>
                <main className="h-auto min-h-[100%] flex justify-center">
                  <div className="max-w-screen-xl">
                    {children}
                  </div>
                </main>
                <Footer/>
              </SnackbarProvider>
            </body>
          </NextIntlClientProvider>
        </html>
      </RecoilProvider>
    </ClerkProvider>
  );
}
