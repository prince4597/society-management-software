import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from './errors';

type ValidationTarget = 'body' | 'query' | 'params';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidateOptions) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    const validateTarget = (target: ValidationTarget, schema?: ZodSchema): void => {
      if (!schema) return;

      const result = schema.safeParse(req[target]);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          const path = `${target}.${err.path.join('.')}`;
          if (!errors[path]) errors[path] = [];
          errors[path].push(err.message);
        });
      } else {
        if (target === 'body') req.body = result.data as Record<string, unknown>;
        if (target === 'query') req.query = result.data as typeof req.query;
        if (target === 'params') req.params = result.data as typeof req.params;
      }
    };

    validateTarget('body', schemas.body);
    validateTarget('query', schemas.query);
    validateTarget('params', schemas.params);

    if (Object.keys(errors).length > 0) {
      next(new ValidationError('Validation failed', errors));
      return;
    }

    next();
  };
};

export const validateBody = <T extends ZodSchema>(schema: T): ReturnType<typeof validate> =>
  validate({ body: schema });

export const validateQuery = <T extends ZodSchema>(schema: T): ReturnType<typeof validate> =>
  validate({ query: schema });

export const validateParams = <T extends ZodSchema>(schema: T): ReturnType<typeof validate> =>
  validate({ params: schema });
