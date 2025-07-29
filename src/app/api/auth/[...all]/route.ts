 
import { auth } from "@/lib/auth"
import { NextRequest } from "next/server"

 
const handler = auth.handler 

export async function GET(request: NextRequest) {
  console.log(`Auth GET request: ${request.method} ${request.url}`)
  return handler(request)
}

export async function POST(request: NextRequest) {
  console.log(`Auth POST request: ${request.method} ${request.url}`)
  return handler(request)
}
 
export const runtime = 'nodejs'  
 
export const dynamic = 'force-dynamic'