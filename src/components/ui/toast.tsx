import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const variants = {
    default: "bg-card border-border text-card-foreground",
    destructive: "bg-destructive/10 border-destructive/20 text-destructive",
    success: "bg-chart-4/10 border-chart-4/20 text-chart-4"
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 max-w-sm w-full p-4 border rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-up",
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-sm mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}