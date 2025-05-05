import { Mail } from 'src/shared';

export class MailSenderEvent {
  constructor(public readonly mail: Mail) {}
}
