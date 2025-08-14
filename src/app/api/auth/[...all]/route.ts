import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    return await auth.handler(request)
  } catch (error) {
    console.error("Auth GET error:", error)
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    return await auth.handler(request)
  } catch (error) {
    console.error("Auth POST error:", error)
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'