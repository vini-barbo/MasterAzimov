import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "shimmer" | "pulse" | "wave"
}

export function AnimatedSkeleton({ className, variant = "shimmer", ...props }: AnimatedSkeletonProps) {
  const variantClasses = {
    shimmer: "skeleton-shimmer",
    pulse: "skeleton-pulse bg-muted",
    wave: "skeleton-wave",
  }

  return <div className={cn("rounded-md", variantClasses[variant], className)} {...props} />
}

export function LoadingDots() {
  return (
    <div className="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}
