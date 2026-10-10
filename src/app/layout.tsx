import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteUrl, sharedOpenGraph, siteDescription, siteName, siteTitle, socialImage } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: siteTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  openGraph: { ...sharedOpenGraph, title: siteTitle, description: siteDescription, url: "/" },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: [socialImage] },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={geistSans.variable}>
      <body>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />

      {children}

      <Footer />
      </body>
      </html>
  );
}
