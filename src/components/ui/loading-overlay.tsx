
"use client"

import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "overlay" | "inline" | "fullscreen"
}

export default function LoadingOverlay({
  isLoading,
  message = "Loading...",
  className,
  size = "md",
  variant = "overlay",
}: LoadingOverlayProps) {
  if (!isLoading) return null

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const variantClasses = {
    overlay: "fixed inset-0 z-20 bg-background/80 backdrop-blur-sm",
    inline: "relative",
    fullscreen: "fixed inset-0 z-20 bg-background",
  }

  return (
    <div className={cn(variantClasses[variant], "flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {message && (
          <p
            className={cn("text-foreground", size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base")}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
