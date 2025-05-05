import { Module } from '@nestjs/common';
import { SmtpmailerService } from './smtpmailer.service';
import { SmtpmailerController } from './smtpmailer.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow<string>('MAIL_HOST'),
          auth: {
            user: config.getOrThrow<string>('MAIL_USERNAME'),
            pass: config.getOrThrow<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"SYSTEM" <${config.getOrThrow<string>('MAIL_FROM')}>`,
        },
      }),
    }),
  ],
  controllers: [SmtpmailerController],
  providers: [SmtpmailerService],
})
export class SmtpmailerModule {}
