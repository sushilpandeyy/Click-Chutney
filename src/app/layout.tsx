import type { Metadata } from "next";
import "./globals.css";

// Use CSS imports for fonts instead of next/font/google to avoid Turbopack issues
const inter = {
  variable: "--font-inter",
  className: "font-inter",
};

const poppins = {
  variable: "--font-poppins", 
  className: "font-poppins",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://clickchutney.com'),
  title: {
    default: "ClickChutney - Analytics Dashboard",
    template: "%s | ClickChutney"
  },
  description: "Powerful web analytics platform with real-time tracking, detailed insights, and beautiful dashboards. Track user behavior, monitor performance, and grow your business with ClickChutney.",
  keywords: ["analytics", "web tracking", "dashboard", "user behavior", "website analytics", "real-time tracking"],
  authors: [{ name: "ClickChutney Team" }],
  creator: "ClickChutney",
  publisher: "ClickChutney",
  applicationName: "ClickChutney Analytics",
  category: "Analytics",
  classification: "Business",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clickchutney.com",
    siteName: "ClickChutney",
    title: "ClickChutney - Analytics Dashboard",
    description: "Powerful web analytics platform with real-time tracking, detailed insights, and beautiful dashboards.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ClickChutney Analytics Dashboard",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickChutney - Analytics Dashboard",
    description: "Powerful web analytics platform with real-time tracking and detailed insights.",
    images: ["/og-image.svg"],
    creator: "@clickchutney",
  },
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased font-inter`}
      >
          {children}
      </body>
    </html>
  );
}
