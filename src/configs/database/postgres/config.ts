import { registerAs } from '@nestjs/config';
export default registerAs('postgres', () => ({
  host: process.env.DATABASE_POSTGRES_HOST,
  port: process.env.DATABASE_POSTGRES_PORT,
  username: process.env.DATABASE_POSTGRES_USERNAME,
  password: process.env.DATABASE_POSTGRES_PASSWORD,
  database: process.env.DATABASE_POSTGRES_DATABASE,
}));
