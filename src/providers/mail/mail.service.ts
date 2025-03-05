import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@prep-ai/mustache-markdown';
import { SES } from 'aws-sdk';
import { promises as fs } from 'fs';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import { join } from 'path';

import { Configuration } from '@/config/configuration.interface';

import { MailOptions } from './mail.interface';

type Func<T> = (val: T) => any;

const memoize = <T = any>(fn: Func<T>) => {
  const cache = new Map();
  const cached = function (this: any, val: T) {
    return cache.has(val)
      ? cache.get(val)
      : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transport: Mail;
  private config: Configuration['email'];
  private queue = new PQueue({ concurrency: 1 });

  //private templateCache = new NodeCache({ stdTTL: 60 * 5 }); // 5 minutes
  //TODO: Read file and update process
  private readTemplate = memoize(this.readTemplateUnmemoized);
  /*  private readTemplate  = memoize(this.readTemplateUnmemoized, {
    maxAge: 1000 * 60 * 35 // Example: cache for 5 minutes
  }); */

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<Configuration['email']>('email');
    if (this.config.ses?.accessKeyId)
      this.transport = nodemailer.createTransport({
        SES: new SES({
          apiVersion: '2010-12-01',
          accessKeyId: this.config.ses.accessKeyId,
          secretAccessKey: this.config.ses.secretAccessKey,
          region: this.config.ses.region,
        }),
      } as SESTransport.Options);
    else this.transport = nodemailer.createTransport(this.config.transport);
  }

  send(options: Mail.Options & MailOptions) {
    this.queue
      .add(() =>
        pRetry(
          () =>
            this.sendMail({
              ...options,
              from:
                options.from ?? `"${this.config.name}" <${this.config.from}>`,
            }),
          {
            retries: this.configService.get<number>('email.retries') ?? 3,
            onFailedAttempt: (error) => {
              this.logger.error(
                `Mail to ${options.to} failed, retrying (${error.retriesLeft} attempts left)`,
                error.name,
              );
            },
          },
        ),
      )
      .then(() => {})
      .catch(() => {});
  }

  private async sendMail(options: Mail.Options & MailOptions) {
    if (options.template) {
      const layout = await this.readTemplate('layout.html');
      let template = await this.readTemplate(options.template);
      let [markdown, html] = await Promise.all(render(template, options.data));
      if (markdown.startsWith('#')) {
        const subject = markdown.split('\n', 1)[0].replace('#', '').trim();
        if (subject) {
          options.subject = options.subject ?? subject;
          markdown = markdown.replace(`# ${markdown.split('\n', 1)[0]}`, '');
        }
      }

      options.html = options.noLayout
        ? html
        : (await Promise.all(render(layout, { content: html })))[1];
      options.text = markdown;
      options.alternatives = [
        {
          contentType: 'text/x-web-markdown',
          content: markdown,
        },
      ];
    }
    return this.transport.sendMail(options);
  }

  private async readTemplateUnmemoized(name: string) {
    if (!name.endsWith('.html')) name = `${name}.md`;
    return fs.readFile(join('.', 'src', 'templates', name), 'utf8');
  }
}
