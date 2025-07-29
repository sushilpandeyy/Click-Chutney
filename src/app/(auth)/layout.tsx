import { Metadata } from "next"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: {
    template: "%s | ClickChutney",
    default: "Authentication | ClickChutney"
  },
  description: "Secure authentication for ClickChutney - Your spicy analytics platform",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
       
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
          className: "my-toast",
          duration: 4000,
        }}
        closeButton
        richColors
      />
       
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Clear any cached auth state on auth pages
            if (typeof window !== 'undefined') {
              // Clear any stale session data
              try {
                const staleKeys = Object.keys(localStorage).filter(key => 
                  key.startsWith('auth-') || key.includes('session')
                )
                staleKeys.forEach(key => localStorage.removeItem(key))
              } catch (e) {
                // Silent fail - localStorage might not be available
              }
            }
          `
        }}
      />
    </div>
  )
}