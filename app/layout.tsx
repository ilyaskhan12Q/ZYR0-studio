import type { Metadata, Viewport } from "next";
import { Inter, PT_Sans } from "next/font/google";

import TanstackProvider from "@/components/providers/tanstack-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/assets/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { BackendStatusBanner } from "@/components/backend-status-banner";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-ptSans-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ZYR0 Studio",
  description:
    "ZYR0 Studio is an AI-powered development environment that enables autonomous multi-file web development through intelligent tool usage. Build complete applications with natural language.",
  openGraph: {
    title: "ZYR0 Studio | Agentic AI Development",
    description:
      "ZYR0 Studio is an AI-powered development environment that enables autonomous multi-file web development through intelligent tool usage. Build complete applications with natural language.",
    siteName: "ZYR0 Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYR0 Studio | Agentic AI Development",
    description:
      "ZYR0 Studio is an AI-powered development environment that enables autonomous multi-file web development through intelligent tool usage. Build complete applications with natural language.",
  },
  appleWebApp: {
    capable: true,
    title: "ZYR0 Studio",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/zyr0-logo.png", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ptSans.variable} antialiased bg-background h-[100dvh] overflow-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Toaster richColors position="bottom-center" />
          <BackendStatusBanner />
          <TanstackProvider>
            {children}
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
