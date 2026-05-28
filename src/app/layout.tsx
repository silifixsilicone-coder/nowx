import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReactVerse - Mobile-First Social Space",
  description: "A premium hybrid social experience fusing visual stories, discussions, and battles.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      <body className="min-h-full flex flex-col no-scrollbar">
        {children}
      </body>
    </html>
  );
}
