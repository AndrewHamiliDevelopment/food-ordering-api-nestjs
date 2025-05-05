import { Test, TestingModule } from '@nestjs/testing';
import { SmtpmailerController } from './smtpmailer.controller';
import { SmtpmailerService } from './smtpmailer.service';

describe('SmtpmailerController', () => {
  let controller: SmtpmailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmtpmailerController],
      providers: [SmtpmailerService],
    }).compile();

    controller = module.get<SmtpmailerController>(SmtpmailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
