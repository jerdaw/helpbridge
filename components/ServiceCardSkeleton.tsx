'use client';

import React from 'react';

const ServiceCardSkeleton = () => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="w-full">
                    {/* Header: Name + Badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800"></div>
                        <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800"></div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mt-3">
                        <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800"></div>
                        <div className="h-4 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800"></div>
                    </div>
                </div>
            </div>

            {/* Address / Phone */}
            <div className="mt-4 flex flex-col gap-2">
                <div className="h-4 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800"></div>
                <div className="h-4 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800"></div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded-md bg-neutral-100 dark:bg-neutral-800"></div>
                <div className="h-6 w-20 rounded-md bg-neutral-100 dark:bg-neutral-800"></div>
            </div>

            {/* Footer Links */}
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <div className="h-4 w-20 rounded bg-neutral-100 dark:bg-neutral-800"></div>
                <div className="h-4 w-16 rounded bg-neutral-100 dark:bg-neutral-800"></div>
            </div>
        </div>
    );
};

export default ServiceCardSkeleton;
