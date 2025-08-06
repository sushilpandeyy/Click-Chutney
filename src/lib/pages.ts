import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'

const pagesDirectory = path.join(process.cwd(), 'content/pages')

export interface PageData {
  slug: string
  title: string
  description: string
  keywords?: string
  publishedAt: string
  updatedAt: string
  content: string
  lastModified: string
}

export async function getAllPages(): Promise<PageData[]> {
  try {
    const fileNames = fs.readdirSync(pagesDirectory)
    const allPagesData = await Promise.all(
      fileNames
        .filter((name) => name.endsWith('.md'))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.md$/, '')
          const page = await getPageContent(slug)
          return page
        })
    )
    
    return allPagesData.filter(Boolean) as PageData[]
  } catch (error) {
    console.error('Error reading pages directory:', error)
    return []
  }
}

export async function getPageContent(slug: string): Promise<PageData | null> {
  try {
    const fullPath = path.join(pagesDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const stats = fs.statSync(fullPath)
    
    const { data, content } = matter(fileContents)
    
    // Process markdown to HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(content)
    
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      keywords: data.keywords || '',
      publishedAt: data.publishedAt || stats.birthtime.toISOString(),
      updatedAt: data.updatedAt || stats.mtime.toISOString(),
      content: contentHtml,
      lastModified: stats.mtime.toISOString(),
    }
  } catch (error) {
    console.error(`Error reading page ${slug}:`, error)
    return null
  }
}

export function getPagePaths(): string[] {
  try {
    const fileNames = fs.readdirSync(pagesDirectory)
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''))
  } catch (error) {
    console.error('Error reading pages directory:', error)
    return []
  }
}