import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishna AI - Bhagavad Gita Guide",
  description: "A virtual guide to the Bhagavad Gita in the voice of Lord Krishna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Kaisei+Tokumin:wght@400;700&family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" precedence="default" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" precedence="default" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
