'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { Service, VerificationLevel } from '../types/service';

interface ServiceCardProps {
    service: Service;
    score?: number; // Optional search score for display or debugging
    matchReasons?: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, score, matchReasons }) => {
    const isVerified = service.verification_level === VerificationLevel.L2 || service.verification_level === VerificationLevel.L3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800"
        >
            {/* Search Match Highlight (Optional - only if relevant reasons exist) */}
            {matchReasons && matchReasons.length > 0 && resultIsHighlyRelevant(score) && (
                <div className="mb-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    ✨ {matchReasons[0]}
                </div>
            )}

            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {service.name}
                        </h3>
                        {isVerified && (
                            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <ShieldCheck className="h-3 w-3" />
                                Verified
                            </span>
                        )}
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                            {service.intent_category}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {service.description.length > 150
                            ? `${service.description.substring(0, 150)}...`
                            : service.description}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                {service.address && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span>{service.address}</span>
                    </div>
                )}
                {service.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
                        <a href={`tel:${service.phone}`} className="hover:text-blue-600 hover:underline">
                            {service.phone}
                        </a>
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {service.identity_tags.slice(0, 3).map((tag, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700"
                    >
                        {tag.tag}
                    </span>
                ))}
            </div>

            <div className="mt-4 flex justify-end">
                <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                    Details <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </motion.div>
    );
};

// Helper: Determine if we should show the "Magic Sparkle" reason
function resultIsHighlyRelevant(score?: number) {
    return score && score > 35;
}

export default ServiceCard;
