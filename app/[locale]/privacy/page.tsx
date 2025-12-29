'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Cookie, Ghost } from 'lucide-react';

export default function PrivacyPage() {
    const t = useTranslations('Privacy');

    return (
        <main className="min-h-screen bg-stone-50 px-4 py-12 dark:bg-neutral-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                        {t('title')}
                    </h1>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                        {t('intro')}
                    </p>
                </header>

                <div className="space-y-6">
                    {/* Card 1: No Tracking */}
                    <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Ghost className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Zero Tracking</h3>
                                <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                                    {t('points.noTracking')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Essential Cookies Only */}
                    <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Cookie className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No Ads, No Data Mining</h3>
                                <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                                    {t('points.noCookies')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: No Search Logging */}
                    <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Private Search</h3>
                                <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                                    {t('points.noLogging')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-sm text-neutral-500">
                        {t('contact')}
                    </p>
                </footer>
            </div>
        </main>
    );
}
