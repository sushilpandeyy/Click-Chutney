import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClickChutney Analytics - Privacy-First Web Analytics Platform",
    template: "%s | ClickChutney Analytics"
  },
  description: "ClickChutney is a privacy-focused, real-time web analytics platform. Track website performance, user behavior, and conversions without compromising user privacy. Easy integration with React, Next.js, and vanilla HTML.",
  keywords: [
    "web analytics",
    "privacy-first analytics", 
    "real-time analytics",
    "website tracking",
    "user behavior analysis",
    "React analytics",
    "Next.js analytics",
    "Google Analytics alternative",
    "GDPR compliant analytics",
    "open source analytics"
  ],
  authors: [{ name: "ClickChutney Analytics" }],
  creator: "ClickChutney Analytics",
  publisher: "ClickChutney Analytics",
  applicationName: "ClickChutney Analytics",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://clickchutney.vercel.app",
    siteName: "ClickChutney Analytics",
    title: "ClickChutney Analytics - Privacy-First Web Analytics Platform",
    description: "Track website performance and user behavior with our privacy-focused analytics platform. Easy integration, real-time insights, GDPR compliant.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClickChutney Analytics - Privacy-First Web Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickChutney Analytics - Privacy-First Web Analytics Platform",
    description: "Track website performance and user behavior with our privacy-focused analytics platform. Easy integration, real-time insights, GDPR compliant.",
    creator: "@clickchutney",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://clickchutney.vercel.app"),
  alternates: {
    canonical: "/",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ClickChutney Analytics",
    "description": "Privacy-focused, real-time web analytics platform for tracking website performance and user behavior.",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://clickchutney.vercel.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free plan available with paid upgrades"
    },
    "author": {
      "@type": "Organization",
      "name": "ClickChutney Analytics"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "Real-time analytics",
      "Privacy-first tracking",
      "Easy integration",
      "Custom events",
      "Team collaboration",
      "Data export"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClickChutney" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
