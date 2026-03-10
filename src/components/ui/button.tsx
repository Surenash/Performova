import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"


import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = {
  // ... (omitted for brevity in thinking, but I must provide full context in call)

  default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90",
  destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/90",
  outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
  ghost: "hover:bg-zinc-100 hover:text-zinc-900",
  link: "text-zinc-900 underline-offset-4 hover:underline",
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}

export interface ButtonProps
  extends HTMLMotionProps<"button"> {
  asChild?: boolean
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? motion(Slot) : motion.button
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"


export { Button, buttonVariants }
