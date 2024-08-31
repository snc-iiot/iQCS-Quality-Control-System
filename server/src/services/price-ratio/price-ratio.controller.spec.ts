import { Test, TestingModule } from '@nestjs/testing';
import { PriceRatioController } from './price-ratio.controller';
import { PriceRatioService } from './price-ratio.service';

describe('PriceRatioController', () => {
  let controller: PriceRatioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceRatioController],
      providers: [PriceRatioService],
    }).compile();

    controller = module.get<PriceRatioController>(PriceRatioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
