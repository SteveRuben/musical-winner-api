import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';
import { RawBodyMiddleware } from '@/middleware/raw-body.middleware';
import { JsonBodyMiddleware } from '@/middleware/json-body.middleware';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { ApiLoggerMiddleware } from '@/middleware/api-logger.middleware';
import { PrismaModule } from '@/prisma/prisma.module';
import { RateLimitInterceptor } from '@/interceptors/rate-limit.interceptor';
import { AuditLogger } from '@/interceptors/audit-log.interceptor';
import { PrepAIAuthGuard } from '@/modules/auth/prepai-auth.guard';
import { ScopesGuard } from '@/modules/auth/scope.guard';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { WebhooksModule } from '@/modules/webhooks/webhooks.module';
import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module';
import { GeolocationModule } from '@/providers/geolocation/geolocation.module';
import { StripeModule } from '@/modules/stripe/stripe.module';
import { ElasticSearchModule } from '@/providers/elasticsearch/elasticsearch.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ApiKeysModule } from '@/modules/api-keys/api-keys.module';
import { ApprovedSubnetsModule } from '@/modules/approved-subnets/approved-subnets.module';
import { MembershipsModule } from '@/modules/memberships/memberships.module';
import { MailModule } from '@/providers/mail/mail.module';
import { S3Module } from '@/providers/s3/s3.module';
import { TalentModule } from '@modules/talents/talent.module';
import serverConfig from './config/server.config';
import { DomainsModule } from '@/modules/domains/domains.module';
import { DnsModule } from '@/providers/dns/dns.module';
import { UsersModule } from '@/modules/users/users.module';
import { SessionsModule } from '@/modules/sessions/sessions.module';
import { GroupsModule } from '@/modules/groups/groups.module';
import { EmailsModule } from '@/modules/emails/emails.module';
import { MultiFactorAuthenticationModule } from '@/modules/multi-factor-authentication/multi-factor-authentication.module';
import { TasksModule } from '@/providers/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MeetingsModule } from '@/modules/meetings/meetings.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TemplatesModule } from '@/modules/templates/templates.module';
import { WallpapersModule } from '@/modules/wallpapers/wallpapers.module';
import { ExperienceRatingsModule } from '@/modules/experience-ratings/experience-ratings.module';
import { SurveysModule } from '@/modules/surveys/surveys.module';
import { SharedModule } from '@/providers/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration,serverConfig],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    TasksModule,
    UsersModule,
    AuthModule,
    MailModule,
    SessionsModule,
    EmailsModule,
    GroupsModule,
    MultiFactorAuthenticationModule,
    ApiKeysModule,
    ApprovedSubnetsModule,
    DomainsModule,
    DnsModule,
    GeolocationModule,
    MembershipsModule,
    StripeModule,
    AuditLogsModule,
    WebhooksModule,
    ElasticSearchModule,
    /* SlackModule,
    AirtableModule, */
    ExperienceRatingsModule,
    SurveysModule,
    SharedModule,
    S3Module,
    MeetingsModule,
    TemplatesModule,
    TalentModule,
    WallpapersModule,
    /*   CloudinaryModule,
    FirebaseModule,
    GitHubModule,
    GoogleMapsModule, */
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: PrepAIAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ScopesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogger,
    },
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/webhooks/stripe',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*')
      .apply(ApiLoggerMiddleware)
      .forRoutes('*')
      .apply(ResponseTimeMiddleware)
      .forRoutes('*')
  }
}
