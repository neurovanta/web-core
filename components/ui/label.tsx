// "use client"

// import * as React from "react"
// import * as LabelPrimitive from "@radix-ui/react-label"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const labelVariants = cva(
//   "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  font-semibold"
// )

// const Label = React.forwardRef<
//   React.ElementRef<typeof LabelPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
//   VariantProps<typeof labelVariants>
//   & { main?: boolean }
//   & { oneInput?: boolean }
// >(({ className, main, oneInput, ...props }, ref) => (
//   <LabelPrimitive.Root
//     ref={ref}
//     className={cn(labelVariants(), className, `${main ? "pl-5 border-b border-black/20 py-5 text-lg font-semibold" : "text-[16px] font-light"} ${oneInput ? "font-semibold text-md" : ""}`)}
//     {...props}
//   />
// ))
// Label.displayName = LabelPrimitive.Root.displayName

// export { Label }



"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> &
  { main?: boolean; oneInput?: boolean; isHidden?: boolean; onToggleHidden?: () => void }
>(({ className, main, oneInput, isHidden, onToggleHidden, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants(),
      className,
      main
        ? "relative flex items-center justify-between gap-3 border-b border-black/10 py-4 pl-5 pr-4 text-[16px] font-semibold tracking-[-0.01em] text-secondary before:absolute before:left-0 before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gradient-to-b before:from-secondary before:to-primary"
        : "text-[16px] font-light",
      oneInput ? "font-semibold text-md" : ""
    )}
    {...props}
  >
    {children}
    {main && onToggleHidden !== undefined && (
      // stopPropagation: inside a collapsible AdminItemContainer header, toggling visibility must not open / close the card
      <span
        role="switch"
        tabIndex={0}
        aria-checked={!isHidden}
        aria-label={isHidden ? "Hidden on the website" : "Visible on the website"}
        title={isHidden ? "Hidden on the website - click to show" : "Visible on the website - click to hide"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleHidden();
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          e.stopPropagation();
          onToggleHidden();
        }}
        className={cn(
          "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20",
          isHidden
            ? "border-border-color/70 bg-cream-bg text-gray-500 hover:border-gray-400"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
        )}
      >
        {isHidden ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
      </span>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }