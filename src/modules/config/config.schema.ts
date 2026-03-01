import { z } from 'zod';
import { ENVIRONMENTS } from './config.constants.js';

import pkg from '../../../package.json';
//accpet unknown
const configSchema = z.object({
  CONFIG_ENVIRONMENT: z.enum(ENVIRONMENTS).nonoptional(),
  PORT: z.coerce.number().int().positive().nonoptional(),
  DATABASE_URL: z.url().nonoptional(),
  CI: z.string().optional(),
  APP_VERSION: z.string().nonoptional().default(pkg.version),
});

export type AppConfigSchema = z.infer<typeof configSchema>;

export function validate(config: Record<string, unknown>): AppConfigSchema {
  config.APP_VERSION = pkg.version;
  const result = configSchema.safeParse(config);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Config validation failed:\n${formatted}`);
  }
  return result.data;
}

export type AppConfig = z.infer<typeof configSchema>;
