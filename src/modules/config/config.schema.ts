import { z } from 'zod';
import { ENVIRONMENTS } from './config.constants.js';

import pkg from '../../../package.json';

const configSchema = z.object({
  CONFIG_ENVIRONMENT: z.enum(ENVIRONMENTS),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.url(),
  CI: z.string().optional(),
  APP_VERSION: z.string().default(pkg.version),
});

export type AppConfig = z.infer<typeof configSchema>;

export function validate(config: Record<string, unknown>): AppConfig {
  const result = configSchema.safeParse({
    ...config,
    APP_VERSION: pkg.version,
  });
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Config validation failed:\n${formatted}`);
  }
  return result.data;
}
