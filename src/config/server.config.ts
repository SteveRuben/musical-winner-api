// src/config/server.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  ssl: {
    enabled: process.env.SSL_ENABLED === 'true',
    privateKeyPath: process.env.SSL_PRIVATE_KEY_PATH,
    certificatePath: process.env.SSL_CERTIFICATE_PATH,
  },
}));