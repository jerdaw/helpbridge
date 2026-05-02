"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  ExternalLink,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/components/layout/AuthProvider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", labelKey: "overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/services", labelKey: "services", icon: List, exact: false },
  { href: "/dashboard/notifications", labelKey: "notifications", icon: Bell, exact: false },
  { href: "/dashboard/feedback", labelKey: "feedback", icon: MessageSquare, exact: false },
  { href: "/dashboard/analytics", labelKey: "analytics", icon: BarChart3, exact: false },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings, exact: false },
] as const

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const router = useRouter()
  const tNav = useTranslations("Dashboard.navigation")
  const tDashboard = useTranslations("Dashboard")
  const tGlobalNav = useTranslations("Navigation")
  const [mobileOpen, setMobileOpen] = useState(false)

  const normalizedPathname = pathname.replace(/^\/[a-z]{2}(?:-[A-Za-z]+)?(?=\/)/, "")

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return normalizedPathname === href
    return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const sidebarContent = (
    <>
      <a
        href="#main-content"
        className="focus:bg-primary-600 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        {tGlobalNav("skipToMain")}
      </a>

      <div className="flex h-20 items-center border-b border-neutral-200/70 px-5 dark:border-white/10">
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
          <Image src="/logo.png" alt="" width={64} height={32} className="h-8 w-auto shrink-0 object-contain" />
          <div className="min-w-0">
            <span className="heading-display block truncate text-lg font-bold tracking-tight text-neutral-950 dark:text-white">
              CareConnect
            </span>
            <span className="block truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {tDashboard("partner")}
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label={tDashboard("partner")}>
        {navItems.map(({ href, labelKey, icon: Icon, exact }) => {
          const active = isActive(href, exact)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary-50 text-primary-700 ring-primary-100 dark:bg-primary-500/15 dark:text-primary-200 dark:ring-primary-400/10 shadow-sm ring-1"
                  : "text-neutral-600 hover:bg-white/70 hover:text-neutral-950 hover:shadow-sm dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  active ? "text-primary-600 dark:text-primary-300" : "text-neutral-400 group-hover:text-neutral-600"
                )}
                aria-hidden="true"
              />
              <span>{tNav(labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-neutral-200/70 bg-white/54 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 px-2 pb-4">
          <Avatar className="h-9 w-9 border border-white shadow-sm dark:border-white/10">
            <AvatarFallback className="from-primary-100 to-primary-200 text-primary-700 bg-gradient-to-br text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
              {user?.email || "partner"}
            </p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{tNav("roleLabel")}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:text-primary-700 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-white hover:shadow-sm dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {tNav("publicSite")}
          </Link>

          <Button
            variant="ghost"
            className="h-9 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            {tNav("signOut")}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200/70 bg-white/86 px-4 py-3 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-slate-950/86">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={56} height={28} className="h-7 w-auto object-contain" />
          <span className="heading-display text-base font-bold text-neutral-950 dark:text-white">CareConnect</span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={mobileOpen ? tNav("closeMenu") : tNav("openMenu")}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </Button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label={tNav("closeMenu")}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200/75 bg-white/92 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none dark:border-white/10 dark:bg-slate-950/92",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
