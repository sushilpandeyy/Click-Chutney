"use client"

import { PageData } from '@/lib/pages'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

interface PolicyPageProps {
  page: PageData
}

export function PolicyPage({ page }: PolicyPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <span className="text-3xl">🍯</span>
              ClickChutney
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <FileText className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{page.description}</p>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Published: {formatDate(page.publishedAt)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {formatDate(page.updatedAt)}
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8">
            <article 
              className="prose prose-gray dark:prose-invert max-w-none
                prose-headings:text-foreground 
                prose-p:text-muted-foreground 
                prose-strong:text-foreground
                prose-a:text-primary hover:prose-a:text-primary/80
                prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border
                prose-blockquote:border-l-primary prose-blockquote:bg-muted/50
                prose-li:text-muted-foreground
                prose-hr:border-border
                prose-table:text-muted-foreground
                prose-th:text-foreground prose-th:border-border
                prose-td:border-border"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              This document was last updated on {formatDate(page.updatedAt)}
            </p>
            <p>
              If you have any questions about this document, please{' '}
              <Link 
                href="/contact" 
                className="text-primary hover:text-primary/80 underline"
              >
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": page.title,
            "description": page.description,
            "datePublished": page.publishedAt,
            "dateModified": page.updatedAt,
            "author": {
              "@type": "Organization",
              "name": "ClickChutney Analytics"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ClickChutney Analytics",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://clickchutney.vercel.app'}/favicon.ico`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://clickchutney.vercel.app'}/pages/${page.slug}`
            }
          })
        }}
      />
    </div>
  )
}