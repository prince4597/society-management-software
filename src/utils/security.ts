import bcrypt from 'bcrypt';
import xss from 'xss';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const sanitizeString = (input: string): string => {
  return xss(input.trim());
};

export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: unknown) =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};

export const isStrongPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Min 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Needs uppercase');
  if (!/[a-z]/.test(password)) errors.push('Needs lowercase');
  if (!/[0-9]/.test(password)) errors.push('Needs number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Needs special char');

  return { valid: errors.length === 0, errors };
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';

  const masked =
    local.length <= 2
      ? '*'.repeat(local.length)
      : `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`;

  return `${masked}@${domain}`;
};

export const maskSensitiveData = <T extends Record<string, unknown>>(
  data: T,
  sensitiveFields = ['password', 'token', 'secret', 'apiKey']
): T => {
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const isSensitive = sensitiveFields.some((f) => key.toLowerCase().includes(f.toLowerCase()));

    if (isSensitive) {
      masked[key] = '[REDACTED]';
    } else if (key.toLowerCase() === 'email' && typeof value === 'string') {
      masked[key] = maskEmail(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      masked[key] = maskSensitiveData(value as Record<string, unknown>, sensitiveFields);
    } else {
      masked[key] = value;
    }
  }

  return masked as T;
};
