import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { defineConfig } from 'prisma/config';

const environment = process.env.CONFIG_ENVIRONMENT || 'development';
const rootDir = process.cwd();

dotenv.config({ path: path.join(rootDir, 'env', `.env.${environment}`) });
dotenv.config({ path: path.join(rootDir, '.env'), override: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
