import * as path from 'node:path';
import { getEnvironment } from './config.utils.js';

/**
 * Returns the ordered list of .env file paths for ConfigModule.forRoot().
 *
 * NestJS ConfigModule loads files in order but does NOT override already-set
 * values. Since process.env vars (from Docker/CI) are loaded first by Node,
 * they always win. Within the file list, earlier files take precedence.
 *
 * Priority: process.env > .env (root, local overrides) > env/.env.{environment}
 */
export function getEnvFilePaths(): string[] {
  const environment = getEnvironment();
  const rootDir = process.cwd();
  console.log('rootDir', rootDir);

  return [
    path.join(rootDir, '.env'),
    path.join(rootDir, 'env', `.env.${environment}`),
  ];
}
