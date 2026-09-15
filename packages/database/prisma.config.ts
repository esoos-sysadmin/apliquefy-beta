import 'dotenv/config'
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // process.env em vez de env(): env() lança se a var faltar, e `prisma generate`
    // (build na Vercel) não precisa de URL. migrate/db push ainda falham sem ela.
    url: process.env.DATABASE_URL,
  },
});