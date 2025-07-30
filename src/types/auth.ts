// src/types/auth.ts
export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  emailVerified?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: AuthUser
  session?: AuthSession
}

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface FormErrors {
  [key: string]: string
}

export interface AuthFormProps {
  redirectTo?: string
  className?: string
  onSuccess?: (user: AuthUser) => void
  onError?: (error: string) => void
}

// Better Auth specific types
export interface BetterAuthSession {
  user: {
    id: string
    email: string
    name: string
    image?: string
    emailVerified: boolean
  }
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
  }
}

export interface GitHubProfile {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
}

export interface OAuthResult {
  success: boolean
  error?: string
  user?: AuthUser
  redirectTo?: string
}