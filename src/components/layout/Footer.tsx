"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Github, Twitter, Mail, Globe, Shield, FileText, Phone, Info } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api-docs' },
      { name: 'Status', href: 'https://status.clickchutney.com' },
    ],
    company: [
      { name: 'About Us', href: '/pages/about' },
      { name: 'Contact', href: '/pages/contact' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/pages/privacy-policy' },
      { name: 'Terms of Service', href: '/pages/terms-of-service' },
      { name: 'Cookie Policy', href: '/pages/cookie-policy' },
      { name: 'Data Processing', href: '/pages/data-processing' },
      { name: 'GDPR Info', href: '/pages/gdpr' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Contact Support', href: '/pages/contact' },
      { name: 'System Status', href: 'https://status.clickchutney.com' },
      { name: 'Security', href: '/security' },
    ],
  }

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 group mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-primary-foreground font-bold text-lg">🍯</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  ClickChutney
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-md">
                Privacy-first web analytics platform. Track website performance and user behavior 
                without compromising user privacy. GDPR compliant and developer-friendly.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://github.com/clickchutney" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://twitter.com/clickchutney" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/pages/contact">
                    <Mail className="w-4 h-4" />
                    <span className="sr-only">Contact</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Legal & Privacy
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© {currentYear} ClickChutney Analytics. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/pages/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="/pages/terms-of-service" className="hover:text-foreground transition-colors">
                  Terms
                </Link>
                <Link href="/pages/cookie-policy" className="hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://status.clickchutney.com" target="_blank" rel="noopener noreferrer">
                  Status
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="pb-6">
          <div className="flex items-center justify-center space-x-8 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-3 h-3" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-3 h-3" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ClickChutney Analytics",
            "url": process.env.NEXT_PUBLIC_BASE_URL || "https://clickchutney.vercel.app",
            "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://clickchutney.vercel.app"}/logo.png`,
            "description": "Privacy-first web analytics platform for tracking website performance and user behavior",
            "foundingDate": "2024",
            "sameAs": [
              "https://twitter.com/clickchutney",
              "https://github.com/clickchutney",
              "https://linkedin.com/company/clickchutney"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-CLICK-NOW",
              "contactType": "customer service",
              "email": "support@clickchutney.com",
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            }
          })
        }}
      />
    </footer>
  )
}