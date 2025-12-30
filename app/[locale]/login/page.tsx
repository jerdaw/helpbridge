'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: 'Magic link sent! Check your email to sign in.'
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col font-sans">
            <Header />

            <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary-200/20 to-accent-200/20 rounded-full blur-[100px] -z-10 dark:from-primary-900/10 dark:to-accent-900/10" />

                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg mb-6">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white heading-display">
                            Partner Login
                        </h2>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            Access your dashboard to manage services
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-white/50 dark:border-white/5">
                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-xl border-neutral-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                                            placeholder="you@organization.org"
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={`rounded-xl p-4 flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {message.type === 'success' ? (
                                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                        )}
                                        <p className="text-sm font-medium">{message.text}</p>
                                    </div>
                                )}

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 text-base shadow-lg shadow-primary-500/20"
                                    >
                                        {loading ? 'Sending Magic Link...' : 'Sign in with Email'}
                                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                                            New to Care Connect?
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/contact">Apply for a Partner Account</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
