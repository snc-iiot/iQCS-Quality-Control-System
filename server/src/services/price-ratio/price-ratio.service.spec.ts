import { Test, TestingModule } from '@nestjs/testing';
import { PriceRatioService } from './price-ratio.service';

describe('PriceRatioService', () => {
  let service: PriceRatioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceRatioService],
    }).compile();

    service = module.get<PriceRatioService>(PriceRatioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
