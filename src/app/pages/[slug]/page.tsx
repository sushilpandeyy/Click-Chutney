import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { PolicyPage } from '@/components/pages/PolicyPage'
import { getPageContent, getAllPages } from '@/lib/pages'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageContent(slug)
  
  if (!page) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clickchutney.vercel.app'
  const pageUrl = `${baseUrl}/pages/${slug}`

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    authors: [{ name: 'ClickChutney Analytics' }],
    creator: 'ClickChutney Analytics',
    publisher: 'ClickChutney Analytics',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: pageUrl,
      siteName: 'ClickChutney Analytics',
      type: 'article',
      publishedTime: page.publishedAt,
      modifiedTime: page.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      creator: '@clickchutney',
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageContent(slug)
  
  if (!page) {
    notFound()
  }

  return <PolicyPage page={page} />
}