"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // fixed look: the app defines no shadcn theme tokens (--popover etc.), which left the toast transparent
      theme="light"
      className="toaster group "
      toastOptions={{
        style: { boxShadow: "0 12px 32px -12px rgba(28, 23, 20, 0.55)" },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-[#BFA373]" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#2b231e",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(191, 163, 115, 0.35)",
          "--border-radius": "14px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
