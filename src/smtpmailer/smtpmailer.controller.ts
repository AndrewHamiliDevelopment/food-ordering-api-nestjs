import { Body, Controller, Post } from '@nestjs/common';
import { SmtpmailerService } from './smtpmailer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailDto } from './dto/email.dto';
import { Mail } from 'src/shared';

@Controller({ path: 'smtp-mailer', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('smtp-mailer')
export class SmtpmailerController {
  constructor(private readonly smtpmailerService: SmtpmailerService) {}

  @Post()
  sendMail(@Body() dto: EmailDto) {
    const mail: Mail = {
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
      html: dto.html,
    };
    return this.smtpmailerService.sendAsync({ mail });
  }
}
