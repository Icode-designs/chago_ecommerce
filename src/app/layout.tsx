import type { Metadata } from "next";
import Providers from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chago | AI-Powered Premium Marketplace",
  description:
    "Discover curated products powered by AI. Chago is a premium marketplace where curation meets intelligence.",
  keywords: ["marketplace", "AI", "shopping", "premium", "curated"],
  openGraph: {
    title: "Chago | AI-Powered Premium Marketplace",
    description: "Discover curated products powered by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
