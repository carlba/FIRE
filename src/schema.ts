import { z } from 'zod';

export const envSchema = z
  .object({
    NODE_ENV: z
      .string()
      .trim()
      .default('development')
      .pipe(z.enum(['production', 'development', 'test'])),
    PORT: z.coerce.number().int().positive().default(3000),
  })
  .transform(raw => ({
    NODE_ENV: raw.NODE_ENV,
    PORT: raw.PORT,
    isDevelopment: raw.NODE_ENV !== 'production',
  }));

export type Config = z.infer<typeof envSchema>;
