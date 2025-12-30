import DashboardSidebar from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-stone-50 dark:bg-neutral-950">
            <DashboardSidebar />

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white heading-display">
                            Welcome back, Partner
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Here&apos;s an overview of your organization&apos;s performance on Care Connect.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card variant="interactive">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-500">Total Views</CardTitle>
                                <Eye className="h-4 w-4 text-neutral-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-600 font-medium">+12%</span> from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card variant="interactive">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-500">Referrals</CardTitle>
                                <MousePointerClick className="h-4 w-4 text-neutral-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">85</div>
                                <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-600 font-medium">+5%</span> from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card variant="interactive">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-500">Verified Services</CardTitle>
                                <ShieldCheck className="h-4 w-4 text-neutral-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-neutral-500 mt-1">
                                    All services up to date
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity / Prompt */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Data Quality Score</CardTitle>
                                <CardDescription>Your organization&apos;s data completeness rating.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-24 w-24 rounded-full border-8 border-emerald-100 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-emerald-600">A</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium">Excellent!</p>
                                        <p className="text-sm text-neutral-500">Your services have complete descriptions, hours, and contact info.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 bg-gradient-to-br from-primary-900 to-primary-800 text-white border-none">
                            <CardHeader>
                                <CardTitle className="text-white">Verify your listings</CardTitle>
                                <CardDescription className="text-primary-100">
                                    It&apos;s been 30 days since your last verification. Confirm your service details are still accurate.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="secondary" className="w-full sm:w-auto">
                                    Start Verification
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Link - Manage Services */}
                    <div className="flex justify-end">
                        <Button asChild className="gap-2">
                            <Link href="/dashboard/services">
                                Manage Services &rarr;
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
