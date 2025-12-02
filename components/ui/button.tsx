import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-heading tracking-wide uppercase",
    {
        variants: {
            variant: {
                default: "bg-aegean text-white hover:bg-aegean-dark shadow-md border border-aegean-dark",
                destructive:
                    "bg-terracotta text-white hover:bg-terracotta-dark shadow-md",
                outline:
                    "border-2 border-aegean text-aegean bg-transparent hover:bg-aegean/10",
                secondary:
                    "bg-gold text-obsidian hover:bg-gold-light shadow-md border border-gold-dark",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                gold: "bg-gradient-to-b from-gold-light to-gold text-obsidian border-2 border-gold-dark shadow-lg hover:shadow-gold/50 transform hover:-translate-y-0.5 transition-all",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
