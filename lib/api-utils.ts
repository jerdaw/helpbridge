import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = {
    data?: T;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        offset?: number;
    };
};

/**
 * Standard API Response helper
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createApiResponse<T = any>(
    data: T,
    options: {
        status?: number;
        headers?: HeadersInit;
        meta?: ApiResponse['meta'];
    } = {}
) {
    const { status = 200, headers, meta } = options;

    return NextResponse.json(
        { data, ...(meta && { meta }) },
        { status, headers }
    );
}

/**
 * Standard API Error helper
 */
export function createApiError(
    message: string,
    status: number = 500,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any
) {
    return NextResponse.json(
        { error: message, ...(details && { details }) },
        { status }
    );
}

/**
 * Global Error Handler for API routes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleApiError(error: any) {
    console.error('API Error:', error);

    if (error instanceof ZodError) {
        return createApiError('Validation Error', 400, error.errors);
    }

    if (error instanceof Error) {
        // Handle specific supabase errors or known exceptions here if needed
        return createApiError(error.message, 500);
    }

    return createApiError('Internal Server Error', 500);
}
