import { Test, TestingModule } from '@nestjs/testing';
import { PubmedService } from './pubmed.service';

describe('PubmedService', () => {
  let service: PubmedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubmedService],
    }).compile();

    service = module.get<PubmedService>(PubmedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
