import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  // Empty interface for potential future props
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted loading-shimmer", className)}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center space-y-1">
          <Skeleton className="h-7 w-12 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-7 w-12 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  )
}