import type { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section } from "@/components/ui/section"
import { cn } from "@/lib/utils"

interface StaticPageShellProps {
  title: string
  eyebrow?: string
  description?: string
  meta?: string
  icon?: ReactNode
  children: ReactNode
  maxWidth?: "article" | "wide"
  articleClassName?: string
}

const maxWidthClasses = {
  article: "max-w-3xl",
  wide: "max-w-6xl",
} as const

export function StaticPageShell({
  title,
  eyebrow,
  description,
  meta,
  icon,
  children,
  maxWidth = "article",
  articleClassName,
}: StaticPageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_14%_6%,rgba(34,211,238,0.22),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(99,102,241,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(34,211,238,0.06),transparent_30rem),linear-gradient(180deg,rgba(239,253,255,0.98)_0%,rgba(248,250,252,0.96)_18%,rgba(255,255,255,0.98)_34%,rgba(255,255,255,0.98)_72%,rgba(248,250,252,0.96)_88%,rgba(241,245,249,0.98)_100%)] font-sans dark:bg-[radial-gradient(circle_at_14%_6%,rgba(8,145,178,0.18),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(79,70,229,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(8,145,178,0.08),transparent_30rem),linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_28%,rgba(15,23,42,0.94)_72%,rgba(2,6,23,0.98)_100%)]">
      <div className="bg-noise" />
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Section animate={false} className="relative pt-40 pb-12 md:pt-44 md:pb-16">
          <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
            <div className={cn("mb-8", maxWidth === "wide" ? "max-w-4xl" : undefined)}>
              {eyebrow && (
                <p className="text-accent-700 dark:text-accent-300 text-xs font-semibold tracking-[0.16em] uppercase">
                  {eyebrow}
                </p>
              )}
              <div className="mt-3 flex items-start gap-4">
                {icon && (
                  <span className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                    {icon}
                  </span>
                )}
                <div className="min-w-0">
                  <h1 className="heading-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {description}
                    </p>
                  )}
                  {meta && <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{meta}</p>}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "rounded-2xl border border-neutral-200/75 bg-white/86 p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md sm:p-8 md:p-10 dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10",
                articleClassName
              )}
            >
              {children}
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
