// src/server/custom-server.ts
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { promises } from 'fs';
import helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import { join } from 'path';

interface ServerConfig {
  port: number;
  sslConfig?: {
    privateKeyPath: string;
    certificatePath: string;
  };
}

export class CustomServer {
  private server: http.Server | https.Server;
  private readonly logger = new Logger('CustomServer');
  private app: INestApplication;

  constructor(private readonly config: ServerConfig) {
    this.logger.log(`env? ${process.env.NODE_ENV}`);
  }

  private loadSslCredentials() {
    if (!this.config.sslConfig) {
      throw new Error('SSL configuration not provided');
    }

    try {
      const privateKey = fs.readFileSync(
        this.config.sslConfig.privateKeyPath,
        'utf8',
      );
      const certificate = fs.readFileSync(
        this.config.sslConfig.certificatePath,
        'utf8',
      );

      this.logger.log(
        `Loaded SSL certificate from ${this.config.sslConfig.certificatePath}`,
      );
      return { key: privateKey, cert: certificate };
    } catch (error) {
      this.logger.error('Failed to load SSL credentials:', error);
      throw error;
    }
  }

  async initialize(app: INestApplication) {
    this.app = app;
    const httpAdapter = app.get(HttpAdapterHost).httpAdapter;
    const httpServer = httpAdapter.getHttpServer();

    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    app.enableCors();
    app.setGlobalPrefix('v1');
    const pkg = JSON.parse(
      await promises.readFile(join('.', 'package.json'), 'utf8'),
    );

    //app.useGlobalFilters(new AllExceptionsFilter());

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('Api Description')
      .setVersion(pkg.version)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Si un serveur existe déjà, on le ferme
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => resolve());
      });
    }

    // Créer le nouveau serveur
    if (this.config.sslConfig) {
      this.server = https.createServer(
        this.loadSslCredentials(),
        httpAdapter.getInstance(),
      );
    } else {
      this.server = http.createServer(httpAdapter.getInstance());
    }

    // Attacher le nouveau serveur à l'adaptateur HTTP
    httpAdapter.setHttpServer(this.server);
  }

  async listen(): Promise<void> {
    if (!this.server) {
      throw new Error('Server not initialized. Call initialize() first.');
    }

    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, () => {
        this.logger.log(
          `Server running on port ${this.config.port} (${this.config.sslConfig ? 'HTTPS' : 'HTTP'})`,
        );
        resolve();
      });

      this.server.on('error', (error) => {
        this.logger.error('Server failed to start:', error);
        reject(error);
      });
    });
  }

  async close(): Promise<void> {
    if (!this.server) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          this.logger.error('Error while stopping server:', error);
          return reject(error);
        }
        this.logger.log('Server stopped gracefully');
        resolve();
      });
    });
  }
}
