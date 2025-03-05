import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';

import { StripeService } from './stripe.service';
import { StripeBillingController } from './stripe-billing.controller';
import { StripeInvoicesController } from './stripe-invoices.controller';
import { StripeSourcesController } from './stripe-sources.controller';
import { StripeSubscriptionController } from './stripe-subscription.controller';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [StripeService],
  exports: [StripeService],
  controllers: [
    StripeBillingController,
    StripeInvoicesController,
    StripeSourcesController,
    StripeSubscriptionController,
    StripeWebhookController,
  ],
})
export class StripeModule {}
