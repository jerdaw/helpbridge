import { AlertTriangle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SafetyAlertProps {
    query: string;
    category?: string;
}

const CRISIS_KEYWORDS = ['suicide', 'kill', 'die', 'hurt', 'crisis', 'emergency', 'help', '911', 'dead', 'depression', 'anxiety'];

export default function SafetyAlert({ query, category }: SafetyAlertProps) {
    const isCrisisSearch =
        category === 'Crisis' ||
        CRISIS_KEYWORDS.some(keyword => query.toLowerCase().includes(keyword));

    return (
        <AnimatePresence>
            {isCrisisSearch && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="mb-6 rounded-2xl bg-red-600 p-6 text-white shadow-xl shadow-red-600/20 ring-1 ring-white/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-black/10 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                                <AlertTriangle className="h-7 w-7 text-white" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold leading-tight">
                                    Are you in immediate danger?
                                </h3>
                                <p className="mt-1 text-red-50 font-medium opacity-90">
                                    If you or someone else is at risk of harm, please call emergency services immediately.
                                </p>
                            </div>

                            <a
                                href="tel:911"
                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-red-600 shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                <Phone className="h-5 w-5 fill-current" />
                                Call 911 Now
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
