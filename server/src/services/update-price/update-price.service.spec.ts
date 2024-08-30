import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePriceService } from './update-price.service';

describe('UpdatePriceService', () => {
  let service: UpdatePriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatePriceService],
    }).compile();

    service = module.get<UpdatePriceService>(UpdatePriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
