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
      main ? "pl-5 border-b border-black/20 py-5 text-lg font-semibold flex items-center justify-between pr-5" : "text-[16px] font-light",
      oneInput ? "font-semibold text-md" : ""
    )}
    {...props}
  >
    {children}
    {main && onToggleHidden !== undefined && (
      <span onClick={(e) => { e.preventDefault(); onToggleHidden(); }} className="cursor-pointer">
        {isHidden
          ? <RiEyeOffLine className="text-gray-500" size={22} />
          : <RiEyeLine className="text-green-600" size={22} />
        }
      </span>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }