import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { CustomServer } from './server/custom-server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    cors: true,
  });

  const server = new CustomServer({
    port: parseInt(process.env.PORT) || 5000,
    sslConfig:
      process.env.NODE_ENV === 'production'
        ? {
            privateKeyPath: process.env.SSL_PRIVATE_KEY_PATH,
            certificatePath: process.env.SSL_CERTIFICATE_PATH,
          }
        : undefined,
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  await server.initialize(app);
  await app.init();
  await server.listen();
}

bootstrap();
