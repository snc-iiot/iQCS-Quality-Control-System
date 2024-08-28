import { Test, TestingModule } from '@nestjs/testing';
import { PartManagementController } from './parts.controller';
import { PartManagementService } from './parts.service';

describe('PartManagementController', () => {
  let controller: PartManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartManagementController],
      providers: [PartManagementService],
    }).compile();

    controller = module.get<PartManagementController>(PartManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
