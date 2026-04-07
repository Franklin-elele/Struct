import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
// @ts-ignore: CSS side-effect imports are handled by Next.js
import "./globals.css";


const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-ubuntu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Struct — Structure your life",
  description:
    "A minimal accountability app to help you build discipline through consistent daily action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${ubuntu.variable}`}>
      <body suppressHydrationWarning className={`${ubuntu.className} min-h-full flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}