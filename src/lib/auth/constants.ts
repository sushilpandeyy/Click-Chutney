// src/lib/auth/constants.ts

// Authentication error messages with ClickChutney theme
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Wrong recipe! Check your email and password 🔍",
  USER_NOT_FOUND: "Chef not found in our kitchen! Try signing up 👨‍🍳",
  EMAIL_ALREADY_EXISTS: "This email is already cooking! Try signing in instead 🍳",
  WEAK_PASSWORD: "Password needs more spice! At least 8 characters 🌶️",
  INVALID_EMAIL: "That email looks burnt! Try a fresh one 📧",
  NETWORK_ERROR: "Kitchen's having connection issues! Try again in a moment 📶",
  SERVER_ERROR: "Our kitchen is having a moment! Please try again 🔥",
  SESSION_EXPIRED: "Your cooking session expired! Please sign in again ⏰",
  EMAIL_NOT_VERIFIED: "Please verify your email to enter the kitchen! 📨",
  OAUTH_ERROR: "External sign-in failed! Try another method 🔗",
  RATE_LIMITED: "Too many attempts! Take a chai break and try again ☕",
  ACCOUNT_DISABLED: "Account temporarily disabled. Contact support 🚫",
  INVALID_TOKEN: "Invalid or expired token! Please try again 🎫",
}

// Success messages
export const AUTH_SUCCESS = {
  SIGNIN: "Welcome back to the kitchen! 🍳",
  SIGNUP: "Account created! Welcome to ClickChutney! 🎉",
  SIGNOUT: "Signed out successfully! Come back soon 👋",
  PASSWORD_RESET: "Password reset email sent! Check your inbox 📧",
  EMAIL_VERIFIED: "Email verified! You're all set 🎯",
  PROFILE_UPDATED: "Profile updated successfully! 👨‍🍳",
}

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
}

// Auth route configurations
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/projects",
  "/analytics",
  "/team",
  "/billing",
] as const

// Public routes accessible without authentication
export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/pricing",
  "/contact",
  "/terms",
  "/privacy",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const

// Session configuration
export const SESSION_CONFIG = {
  COOKIE_NAME: "clickchutney-session",
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  REFRESH_THRESHOLD: 7 * 24 * 60 * 60, // 7 days in seconds
  SECURE: process.env.NODE_ENV === "production",
  HTTP_ONLY: true,
  SAME_SITE: "lax" as const,
}

// OAuth providers configuration
export const OAUTH_PROVIDERS = {
  GITHUB: {
    id: "github",
    name: "GitHub",
    icon: "github",
    color: "#333",
  },
  GOOGLE: {
    id: "google", 
    name: "Google",
    icon: "google",
    color: "#4285F4",
  },
} as const

// Form validation rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: VALIDATION_PATTERNS.NAME,
  },
  EMAIL: {
    PATTERN: VALIDATION_PATTERNS.EMAIL,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: VALIDATION_PATTERNS.PASSWORD,
    REQUIREMENTS: [
      "At least 8 characters",
      "One uppercase letter", 
      "One lowercase letter",
      "One number",
    ],
  },
} as const

// Rate limiting configuration
export const RATE_LIMITS = {
  LOGIN: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MESSAGE: AUTH_ERRORS.RATE_LIMITED,
  },
  REGISTER: {
    MAX_ATTEMPTS: 3,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MESSAGE: AUTH_ERRORS.RATE_LIMITED,
  },
  PASSWORD_RESET: {
    MAX_ATTEMPTS: 3,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MESSAGE: AUTH_ERRORS.RATE_LIMITED,
  },
} as const

// Environment configuration
export const ENV_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-change-in-production",
  DATABASE_URL: process.env.DATABASE_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const