import type { Society } from '@/types';

export interface OnboardSocietyInput {
    society: {
        name: string;
        code: string;
        address: string;
        city: string;
        state: string;
        country?: string;
        zipCode: string;
        email?: string;
        phone?: string;
        totalFlats?: number;
    };
    admin: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        password: string;
    };
}

export interface OnboardSocietyResponse {
    society: Society;
    admin: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}
