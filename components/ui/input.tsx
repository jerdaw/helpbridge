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
                        "peer w-full rounded-2xl border border-neutral-200 bg-white/50 backdrop-blur-xl shadow-inner-light",
                        "px-5 py-3.5 text-neutral-900 placeholder-transparent outline-none",
                        "transition-all duration-300",
                        "focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:shadow-lg focus:shadow-primary-500/10",
                        "hover:border-neutral-300 hover:bg-white/80",
                        "dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-primary-500 dark:focus:bg-neutral-900/80 dark:focus:ring-primary-500/10",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        icon && "pl-12",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                        className
                    )}
                    ref={ref}
                    placeholder={label || "Input"}
                    {...props}
                />
                {label && (
                    <label className={cn(
                        "absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-neutral-500 rounded-full shadow-sm",
                        "transition-all duration-200 pointer-events-none",
                        "peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:bg-transparent peer-placeholder-shown:shadow-none",
                        "peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:shadow-sm dark:peer-focus:bg-neutral-900",
                        "dark:bg-neutral-900 dark:text-neutral-400",
                        icon && "peer-placeholder-shown:left-12 peer-focus:left-4"
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
