// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"

export const handler = auth.handler