import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
// @ts-ignore: CSS side-effect imports are handled by Next.js
import "./globals.css";
import { Toaster } from "react-hot-toast";


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
        <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#F1F3E0",
                            color: "#2d3328",
                            border: "1px solid #D2DCB6",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "500",
                        },
                        success: {
                            iconTheme: {
                                primary: "#A1BC98",
                                secondary: "#F1F3E0",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#e57373",
                                secondary: "#F1F3E0",
                            },
                        },
                        duration: 3000,
                    }}
                />
      </body>
    </html>
  );
}