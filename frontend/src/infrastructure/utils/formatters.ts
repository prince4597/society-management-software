/**
 * Phone Number Formatter
 * Standardizes raw input into +CC XXXXXXXXXX format
 */
export const formatPhoneNumber = (val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';

    // Limit to 12 digits (CC + Number)
    const limited = digits.slice(0, 12);

    if (limited.length <= 2) {
        return `+${limited}`;
    }

    return `+${limited.slice(0, 2)} ${limited.slice(2)}`;
};

/**
 * Currency Formatter (Future-proofing)
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * Date Formatter
 */
export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
};
