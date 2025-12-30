"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled
                ? "glass py-3 shadow-md border-b border-neutral-200/50 dark:border-neutral-800/50"
                : "bg-transparent py-5"
        )}>
            <nav className="mx-auto max-w-7xl px-4 flex items-center justify-between sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                        K
                    </div>
                    <span className={cn(
                        "text-xl font-bold tracking-tight transition-colors heading-display",
                        scrolled ? "text-neutral-900 dark:text-white" : "text-white"
                    )}>
                        Care Connect
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/about" className={cn(
                        "text-sm font-medium transition-colors hover:text-primary-500",
                        scrolled ? "text-neutral-600 dark:text-neutral-300" : "text-white/90 hover:text-white"
                    )}>
                        About
                    </Link>
                    <Link href="/partners" className={cn(
                        "text-sm font-medium transition-colors hover:text-primary-500",
                        scrolled ? "text-neutral-600 dark:text-neutral-300" : "text-white/90 hover:text-white"
                    )}>
                        For Partners
                    </Link>

                    <ThemeToggle />

                    {user ? (
                        <Button variant={scrolled ? "default" : "secondary"} asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <Button variant={scrolled ? "default" : "secondary"} asChild>
                            <Link href="/login">Partner Login</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <button
                        className="p-2 text-neutral-600 dark:text-neutral-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu className={scrolled ? "" : "text-white"} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-neutral-200 dark:border-neutral-800"
                    >
                        <div className="p-4 space-y-4 flex flex-col">
                            <Link href="/about" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 p-2">
                                About
                            </Link>
                            <Link href="/partners" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 p-2">
                                For Partners
                            </Link>
                            {user ? (
                                <Button className="w-full" asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            ) : (
                                <Button className="w-full" asChild>
                                    <Link href="/login">Partner Login</Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
