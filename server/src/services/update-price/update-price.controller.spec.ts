import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePriceController } from './update-price.controller';
import { UpdatePriceService } from './update-price.service';

describe('UpdatePriceController', () => {
  let controller: UpdatePriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdatePriceController],
      providers: [UpdatePriceService],
    }).compile();

    controller = module.get<UpdatePriceController>(UpdatePriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
