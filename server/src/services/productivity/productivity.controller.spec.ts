import { Test, TestingModule } from '@nestjs/testing';
import { ProductivityController } from './productivity.controller';
import { ProductivityService } from './productivity.service';

describe('ProductivityController', () => {
  let controller: ProductivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductivityController],
      providers: [ProductivityService],
    }).compile();

    controller = module.get<ProductivityController>(ProductivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
