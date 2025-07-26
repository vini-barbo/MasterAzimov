import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));
