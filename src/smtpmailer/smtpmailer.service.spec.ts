import { Test, TestingModule } from '@nestjs/testing';
import { SmtpmailerService } from './smtpmailer.service';

describe('SmtpmailerService', () => {
  let service: SmtpmailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmtpmailerService],
    }).compile();

    service = module.get<SmtpmailerService>(SmtpmailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
