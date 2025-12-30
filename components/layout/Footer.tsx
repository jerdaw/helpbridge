"use client";

import { Link } from '@/i18n/routing';
// import { useTranslations } from 'next-intl';
import { ShieldCheck, Mail, Github, Twitter } from 'lucide-react';

export function Footer() {
    // const t = useTranslations();

    return (
        <footer className="relative mt-24 bg-neutral-950 text-white overflow-hidden">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Logo & Mission */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                                K
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white heading-display">
                                Kingston Care Connect
                            </span>
                        </div>
                        <p className="text-neutral-400 max-w-md leading-relaxed">
                            Connecting Kingston residents with the support services they need.
                            Built with care for our community.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5 text-neutral-400" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5 text-neutral-400" />
                            </a>
                            <a href="mailto:feedback@kingstoncare.ca" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <Mail className="w-5 h-5 text-neutral-400" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Community</h3>
                        <ul className="space-y-3 text-neutral-400">
                            <li><Link href="/search?category=food" className="hover:text-primary-400 transition-colors">Food Access</Link></li>
                            <li><Link href="/search?category=housing" className="hover:text-primary-400 transition-colors">Housing Support</Link></li>
                            <li><Link href="/search?category=health" className="hover:text-primary-400 transition-colors">Health Services</Link></li>
                            <li><Link href="/search?category=crisis" className="hover:text-primary-400 transition-colors">Crisis Support</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Legal</h3>
                        <ul className="space-y-3 text-neutral-400">
                            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-wrap gap-4 justify-between items-center text-sm text-neutral-500">
                    <p>© 2024 Kingston Care Connect (Pilot v1.0)</p>

                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Privacy First • No Tracking • Open Source</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
