import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SentMessageInfo } from 'nodemailer';
import { MailSenderEvent } from 'src/events/MailSender.event';
import { Mail } from 'src/shared';

@Injectable()
export class SmtpmailerService {
  private logger = new Logger(SmtpmailerService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  send = async (props: { mail: Mail }) => {
    const { mail } = props;
    const { to, subject, text, html } = mail;
    this.logger.log('mail', { to, subject, text, html });
    try {
      const response: SentMessageInfo = await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });
      this.logger.log('🚀 ~ SmtpmailerService ~ send= ~ response:', response);
    } catch (error) {
      this.logger.error('Mailer error', error);
    }
  };

  sendAsync = async (props: { mail: Mail }) => {
    const { mail } = props;
    await this.eventEmitter.emit('send-mail', new MailSenderEvent(mail));
  };

  @OnEvent('send-mail', { async: true })
  async sendEmailEvent(payload: MailSenderEvent) {
    const { mail } = payload;
    this.logger.log('sendMail event', mail);
    await this.send({ mail });
  }
}
