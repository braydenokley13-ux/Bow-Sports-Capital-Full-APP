import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bow Sports Capital",
    template: "%s · Bow Sports Capital",
  },
  description:
    "Bow Sports Capital teaches students economics, finance, and strategic thinking through the business of sports — contracts, salary caps, trades, drafts, analytics, and more.",
  applicationName: "Bow Sports Capital",
  keywords: [
    "sports business",
    "sports economics",
    "front office",
    "student learning",
    "bow sports capital",
    "salary cap",
    "GM simulator",
  ],
  authors: [{ name: "Bow Sports Capital" }],
  openGraph: {
    title: "Bow Sports Capital",
    description:
      "The sports-business academy where students learn economics, finance, and strategy through the front office.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bow Sports Capital",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#030a1c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
