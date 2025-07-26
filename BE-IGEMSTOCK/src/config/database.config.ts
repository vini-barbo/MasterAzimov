import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres123@localhost:5432/igem_stock_dev?schema=public',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres123',
  database: process.env.POSTGRES_DB || 'igem_stock_dev',
}));
