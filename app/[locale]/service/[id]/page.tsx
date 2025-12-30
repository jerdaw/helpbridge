import { notFound } from 'next/navigation';
import { getServiceById } from '@/lib/services';
import { generateFeedbackLink } from '@/lib/feedback';
import { Metadata } from 'next';
import {
    MapPin,
    Phone,
    Globe,
    Clock,
    ShieldCheck,
    CheckCircle2,
    Flag,
    Share2,
    Navigation,
    Printer,
    Mail
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { VerificationLevel } from '@/types/service';

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params;
    const service = await getServiceById(id);
    if (!service) return { title: 'Service Not Found' };

    const name = locale === 'fr' && service.name_fr ? service.name_fr : service.name;
    const description = locale === 'fr' && service.description_fr ? service.description_fr : service.description;

    return {
        title: `${name} | Kingston Care Connect`,
        description: description,
    };
}

export default async function ServicePage({ params }: Props) {
    const { id, locale } = await params;
    const service = await getServiceById(id);
    const t = await getTranslations('ServiceDetail');

    if (!service) {
        notFound();
    }

    const name = locale === 'fr' && service.name_fr ? service.name_fr : service.name;
    const description = (locale === 'fr' && service.description_fr ? service.description_fr : service.description).split('\n');
    const address = locale === 'fr' && service.address_fr ? service.address_fr : service.address;

    const isVerified = service.verification_level === VerificationLevel.L2 || service.verification_level === VerificationLevel.L3;

    // Helper to format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col">
            <Header />

            {/* Hero Header */}
            <div className="relative pt-32 pb-12 overflow-hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 pointer-events-none" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="text-sm py-1">
                                    {service.intent_category}
                                </Badge>
                                {isVerified && (
                                    <Badge variant="primary" className="text-sm py-1 gap-1.5">
                                        <ShieldCheck className="h-4 w-4" /> Verified Service
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight heading-display">
                                {name}
                            </h1>

                            {address && (
                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                    <MapPin className="h-5 w-5 shrink-0" />
                                    <span className="text-lg">{address}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" className="gap-2">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Printer className="h-4 w-4" /> Print
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Section className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                About this Service
                            </h2>
                            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {description.map((paragraph, idx) => (
                                    <p key={idx} className="mb-4">{paragraph}</p>
                                ))}
                            </div>
                        </Card>

                        {/* Eligibility & Requirements */}
                        {(service.eligibility || service.eligibility_notes) && (
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="h-6 w-6 text-primary-600" />
                                    Eligibility
                                </h2>
                                <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl p-6 border border-primary-100 dark:border-primary-800/50">
                                    <p className="text-neutral-700 dark:text-neutral-300">
                                        {service.eligibility_notes || service.eligibility}
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* Application Process */}
                        {service.application_process && (
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-4">Application Process</h2>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    {service.application_process}
                                </p>
                            </Card>
                        )}

                        {/* Accessibility */}
                        {service.accessibility && Object.keys(service.accessibility).length > 0 && (
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(service.accessibility).map(([key, value]) => (
                                        value && (
                                            <Badge key={key} variant="secondary" className="capitalize">
                                                {key.replace('_', ' ')}
                                            </Badge>
                                        )
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <Card className="p-6 sticky top-24">
                            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                {service.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 shrink-0">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-500">Phone</p>
                                            <a href={`tel:${service.phone}`} className="text-primary-600 hover:underline font-medium">
                                                {service.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {service.url && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 shrink-0">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-500">Website</p>
                                            <a href={service.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium break-all">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {service.email && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 shrink-0">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-500">Email</p>
                                            <a href={`mailto:${service.email}`} className="text-primary-600 hover:underline font-medium break-all">
                                                {service.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {address && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 shrink-0">
                                            <Navigation className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-500">Address</p>
                                            <p className="text-neutral-900 dark:text-neutral-200">{address}</p>
                                            <Button variant="link" className="h-auto p-0 mt-1 text-xs" asChild>
                                                <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">
                                                    Get Directions
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {service.hours && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 shrink-0">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-500">Hours</p>
                                            <p className="text-sm text-neutral-900 dark:text-neutral-200 whitespace-pre-line">{service.hours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    <span>Last Verified:</span>
                                    <span>{formatDate(service.last_verified) || 'Unknown'}</span>
                                </div>
                                <div className="mt-4">
                                    <a
                                        href={generateFeedbackLink(service)}
                                        className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-neutral-200"
                                    >
                                        <Flag className="h-3 w-3" />
                                        {t('reportIssue')}
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Footer />
        </main>
    );
}
