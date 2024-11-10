import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { enUS, koKR } from "@clerk/localizations";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/shadcn/ui/toaster";

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
  return (
    <html lang={locale} className="h-[100%]">
      <ClerkProvider localization={locale === "en" ? enUS : koKR}>
        <NextIntlClientProvider messages={messages}>
          <body className={`h-[100%] ${inter.className}`}>
            <Header/>
            <main className="h-auto min-h-[100%] flex justify-center">
              {children}
            </main>
            <Footer/>
            <Toaster />
          </body>
        </NextIntlClientProvider>
      </ClerkProvider>
    </html>
  );
}
