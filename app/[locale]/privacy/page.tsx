'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Cookie, Ghost, Lock, EyeOff, Database } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
    const t = useTranslations('Privacy');

    const features = [
        {
            icon: Ghost,
            title: "Zero Tracking",
            description: t('points.noTracking'),
            color: "blue"
        },
        {
            icon: Cookie,
            title: "No Ads, No Data Mining",
            description: t('points.noCookies'),
            color: "emerald"
        },
        {
            icon: ShieldCheck,
            title: "Private Search",
            description: t('points.noLogging'),
            color: "purple"
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col font-sans">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <Section className="pb-12 pt-32 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 mb-8">
                        <Lock className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl heading-display mb-6">
                        {t('title')}
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {t('intro')}
                    </p>
                </Section>

                {/* Features Grid */}
                <Section className="py-12" variant="alternate">
                    <div className="grid gap-8 md:grid-cols-3">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="p-8 h-full hover:shadow-lg transition-shadow duration-300 border-neutral-200/60 dark:border-neutral-800">
                                <div className={`inline-flex rounded-xl p-3 mb-6 bg-${feature.color}-50 text-${feature.color}-600 dark:bg-${feature.color}-900/20 dark:text-${feature.color}-400`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </Section>

                {/* Detailed Content */}
                <Section className="py-24">
                    <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert prose-lg">
                        <h2>Our Commitment to Privacy</h2>
                        <p>
                            Kingston Care Connect is built with a &quot;privacy-first&quot; architecture. We believe that searching for social services is a sensitive activity, and your data should remain yours.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 not-prose my-12">
                            <div className="flex gap-4">
                                <EyeOff className="h-6 w-6 text-neutral-400 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">No IP Logging</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">We don&apos;t store IP addresses associated with search queries.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Database className="h-6 w-6 text-neutral-400 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">Local Storage</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Saved searches live only on your device, not our servers.</p>
                                </div>
                            </div>
                        </div>

                        <h3>Contact Us</h3>
                        <p>
                            If you have questions about our privacy practices, please contact us at: <br />
                            <a href="mailto:privacy@kingstoncareconnect.com" className="text-primary-600 no-underline hover:underline">privacy@kingstoncareconnect.com</a>
                        </p>
                    </div>
                </Section>
            </main>

            <Footer />
        </div>
    );
}
