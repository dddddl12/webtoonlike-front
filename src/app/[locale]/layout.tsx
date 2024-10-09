import React, { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RecoilProvider } from "@/components/$providers/RecoilProvider";
import { SnackbarProvider } from "@/hooks/Snackbar";
import { ConfirmDialogShared } from "@/hooks/ConfirmDialog";
import { Header } from "@/components/Header";
import "./globals.css";
import { AOSInit } from "@/ui/AOS";
import { Footer } from "@/components/Footer";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { enUS, koKR } from "@clerk/localizations";
import { Authenticate } from "@/components/Authenticate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebtoonLike",
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
          <AOSInit />
          <NextIntlClientProvider messages={messages} timeZone="Asia/Seoul">
            <body className={`h-[100%] ${inter.className}`}>
              <main className="h-[100%]">
                <ConfirmDialogShared />
                <SnackbarProvider>
                  <Authenticate>
                    <Header/>
                    <div className="h-auto min-h-[100%]">
                      {children}
                    </div>
                    <Footer />
                  </Authenticate>
                </SnackbarProvider>
              </main>
            </body>
          </NextIntlClientProvider>
        </html>
      </RecoilProvider>
    </ClerkProvider>
  );
}
