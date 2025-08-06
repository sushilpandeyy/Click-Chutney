import { Metadata } from 'next'

export const homeMetadata: Metadata = {
  title: "ClickChutney Analytics - Privacy-First Web Analytics Platform",
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
    "conversion tracking",
    "privacy respecting analytics",
    "website performance monitoring"
  ],
  openGraph: {
    title: "ClickChutney Analytics - Privacy-First Web Analytics Platform",
    description: "Track website performance and user behavior with our privacy-focused analytics platform. Easy integration, real-time insights, GDPR compliant.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "ClickChutney Analytics Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickChutney Analytics - Privacy-First Web Analytics Platform",
    description: "Track website performance and user behavior with our privacy-focused analytics platform. Easy integration, real-time insights, GDPR compliant.",
    images: ["/og-home.png"],
  },
  alternates: {
    canonical: "/",
  },
}