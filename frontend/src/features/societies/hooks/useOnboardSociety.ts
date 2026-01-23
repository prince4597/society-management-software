import { useState } from 'react';
import { formatPhoneNumber } from '@/infrastructure/utils/formatters';
import { societiesService } from '../api/societies.service';
import type { OnboardSocietyInput } from '../types';
import type { ApiError } from '@/infrastructure/api/api-client';

export const useOnboardSociety = (onSuccess?: () => void) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onboard = async (data: {
        society: {
            name: string;
            code: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            email?: string;
            phone?: string;
            totalFlats?: string;
        };
        admin: Record<string, unknown>;
    }) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const input: OnboardSocietyInput = {
            society: {
                name: data.society.name,
                code: data.society.code,
                address: data.society.address,
                city: data.society.city,
                state: data.society.state,
                zipCode: data.society.zipCode,
                email: data.society.email || undefined,
                phone: data.society.phone,
                totalFlats: data.society.totalFlats ? parseInt(data.society.totalFlats, 10) : 0,
            },
            admin: data.admin as OnboardSocietyInput['admin'],
        };

        try {
            const result = await societiesService.onboardSociety(input);
            setSuccess(`Society "${result.society.name}" onboarded successfully`);
            onSuccess?.();
            return { success: true, data: result };
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to onboard society';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const formatPhone = formatPhoneNumber;

    return {
        onboard,
        formatPhone,
        isLoading,
        error,
        success,
        setError,
        setSuccess
    };
};
