"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeInUp } from "@/lib/motion"

type SectionProps = React.HTMLAttributes<HTMLElement> & {
    container?: boolean
    animate?: boolean
    variant?: "default" | "alternate"
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, children, container = true, animate = true, variant = "default", ...props }, ref) => {
        // Explicitly define wrapper based on animation prop
        const Wrapper = animate ? motion.section : "section"

        // Animation props
        const animationProps = animate ? {
            initial: "initial",
            whileInView: "animate",
            viewport: { once: true, margin: "-100px" },
            variants: fadeInUp
        } : {}

        return (
            <Wrapper
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={ref as any}
                className={cn(
                    "py-16 md:py-24 relative overflow-hidden",
                    variant === "alternate" && "bg-neutral-50 dark:bg-neutral-900/50",
                    className
                )}
                {...animationProps}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(props as any)}
            >
                {container ? (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        {children}
                    </div>
                ) : (
                    children
                )}
            </Wrapper>
        )
    }
)
Section.displayName = "Section"

export { Section }
