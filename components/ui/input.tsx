import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        return (
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-600 transition-colors z-10 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "peer w-full rounded-2xl border-2 border-neutral-200 bg-white/80 backdrop-blur-sm",
                        "px-4 py-3 text-neutral-900 placeholder-transparent outline-none",
                        "transition-all duration-200",
                        "focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10",
                        "hover:border-neutral-300 dark:bg-neutral-900/80 dark:border-neutral-800 dark:text-white dark:focus:border-primary-500",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        icon && "pl-11",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                        className
                    )}
                    ref={ref}
                    placeholder={label || "Input"}
                    {...props}
                />
                {label && (
                    <label className={cn(
                        "absolute left-4 -top-2.5 bg-white px-2 text-xs font-medium text-neutral-500 rounded-md",
                        "transition-all duration-200 pointer-events-none",
                        "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:bg-transparent",
                        "peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white dark:peer-focus:bg-neutral-950",
                        "dark:bg-neutral-950 dark:text-neutral-400",
                        icon && "peer-placeholder-shown:left-11 peer-focus:left-4"
                    )}>
                        {label}
                    </label>
                )}
                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
