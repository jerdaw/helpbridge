import { describe, it, expect } from 'vitest';
import { createApiResponse, createApiError } from '../../lib/api-utils';

describe('API Utils', () => {
    it('should create success response', () => {
        const data = { foo: 'bar' };
        const response = createApiResponse(data);
        expect(response).toEqual({
            data,
            meta: {
                timestamp: expect.any(String),
                requestId: expect.any(String),
            },
        });
    });

    it('should create error response', () => {
        const errorResponse = createApiError('Something went wrong', 400);
        expect(errorResponse).toEqual({
            error: {
                message: 'Something went wrong',
                code: 400,
                details: undefined,
            },
            meta: {
                timestamp: expect.any(String),
                requestId: expect.any(String),
            },
        });
    });
});
