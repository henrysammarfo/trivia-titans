import type { Metadata } from "next";
import { Oswald, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-body",
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trivia Titans",
  description: "The ultimate trivia leaderboard for Malaga Trivia.",
  icons: {
    icon: "/assets/malaga logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${lato.variable} antialiased bg-marble-white text-obsidian`}
      >
        <NextIntlClientProvider messages={messages}>
          <Toaster position="top-right" richColors />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
