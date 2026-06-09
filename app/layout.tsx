import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ChatWidget } from "@/components/shared/chat-widget";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ContentPilot — AI-Powered Facebook Content Management",
  description:
    "Create, schedule, and automate your entire Facebook strategy in minutes with AI-driven content management.",
  keywords: [
    "facebook",
    "content management",
    "social media",
    "scheduling",
    "AI",
    "automation",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "ContentPilot",
    description:
      "AI-powered Facebook content planning, publishing, and analytics for teams.",
    type: "website",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentPilot",
    description:
      "AI-powered Facebook content planning, publishing, and analytics for teams.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <ChatWidget />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "dark:bg-dark-surface dark:text-gray-100 dark:border-dark-border",
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
