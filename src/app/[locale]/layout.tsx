import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Providers } from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Recommendations System",
  description: "Recommendation system for 2DV515. Item and User based",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-lightbg text-black dark:bg-darkbg dark:text-white`}
      >
        <Providers>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeSwitcher />
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
