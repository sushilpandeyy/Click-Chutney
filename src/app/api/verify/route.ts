import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { trackingId, domain } = await request.json()

    if (!trackingId || !domain) {
      return NextResponse.json(
        { error: "Missing trackingId or domain" },
        { status: 400 }
      )
    }

    // Find the project by tracking ID
    const project = await prisma.project.findUnique({
      where: { trackingId }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    if (project.isVerified) {
      return NextResponse.json({ verified: true, message: "Already verified" })
    }

    try {
      // Fetch the website's HTML to check for meta tag
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(`https://${domain}`, {
        headers: {
          'User-Agent': 'ClickChutney-Verifier/1.0'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: "Could not fetch website" },
          { status: 400 }
        )
      }

      const html = await response.text()
      
      // Simple regex to find the meta tag instead of using cheerio
      const metaTagRegex = /<meta\s+name=["']clickchutney-verification["']\s+content=["']([^"']+)["']/i
      const match = html.match(metaTagRegex)
      const verificationMeta = match ? match[1] : null
      
      if (verificationMeta === trackingId) {
        // Update project as verified
        await prisma.project.update({
          where: { trackingId },
          data: {
            isVerified: true,
            verifiedAt: new Date()
          }
        })

        return NextResponse.json({ 
          verified: true, 
          message: "Domain verified successfully" 
        })
      } else {
        return NextResponse.json(
          { error: "Verification meta tag not found or incorrect" },
          { status: 400 }
        )
      }

    } catch (fetchError) {
      return NextResponse.json(
        { error: "Failed to verify domain" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Error in domain verification:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}