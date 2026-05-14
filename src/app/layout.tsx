import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-plus-jakarta" 
});

export const metadata: Metadata = {
  title: {
    default: "Nexora ID | Secure Single Sign-On",
    template: "%s | Nexora ID"
  },
  description: "Secure, unified identity provider for the Nexora ecosystem. Access Nexora POS, Menu, and Chai with one enterprise-grade account.",
  keywords: ["Nexora ID", "SSO", "Identity Provider", "OAuth", "Nexora Creatives", "Secure Login", "Authentication"],
  authors: [{ name: "Nexora Creatives" }],
  openGraph: {
    title: "Nexora ID | Unified Identity Provider",
    description: "Access all Nexora applications with one secure account.",
    url: "https://accounts.nexoracreatives.co.ke",
    siteName: "Nexora ID",
    images: [
      {
        url: "/brand/logo.png",
        width: 800,
        height: 800,
        alt: "Nexora ID Logo"
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora ID | Secure Single Sign-On",
    description: "One account for the entire Nexora ecosystem.",
    images: ["/brand/logo.png"],
  },
  metadataBase: new URL("https://accounts.nexoracreatives.co.ke"),
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
